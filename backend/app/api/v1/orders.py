import uuid
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.address import Address
from app.models.cart import CartItem
from app.models.order import Order, OrderItem, Payment
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.user import (
    OrderCreate,
    OrderItemResponse,
    OrderResponse,
)
from app.services import cashfree

router = APIRouter(prefix="/orders", tags=["orders"])

SHIPPING_FEE = Decimal("99.00")
FREE_SHIPPING_THRESHOLD = Decimal("999.00")
GST_RATE = Decimal("0.18")
CENTS = Decimal("0.01")


def _user_id_from_token(current_user: dict) -> uuid.UUID:
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return uuid.UUID(str(user_id))


def _round_money(value: Decimal) -> Decimal:
    return value.quantize(CENTS, rounding=ROUND_HALF_UP)


async def _get_owned_address(
    db: AsyncSession, address_id: uuid.UUID, user_id: uuid.UUID, label: str
) -> Address:
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user_id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{label} address not found",
        )
    return address


async def _load_order_items(db: AsyncSession, order_id: uuid.UUID) -> list[OrderItemResponse]:
    """Load order items joined with product details for serialization."""
    result = await db.execute(
        select(OrderItem, Product)
        .join(Product, Product.id == OrderItem.product_id)
        .where(OrderItem.order_id == order_id)
    )
    items: list[OrderItemResponse] = []
    for item, product in result.all():
        items.append(
            OrderItemResponse(
                id=str(item.id),
                product_id=str(item.product_id),
                variant_id=str(item.variant_id) if item.variant_id else None,
                product_name=product.name,
                product_slug=product.slug,
                quantity=item.quantity,
                unit_price=str(item.unit_price),
                total_price=str(item.total_price),
            )
        )
    return items


def _serialize_order(
    order: Order,
    items: list[OrderItemResponse],
    payment_session_id: str | None = None,
) -> OrderResponse:
    return OrderResponse(
        id=str(order.id),
        status=order.status,
        subtotal=str(order.subtotal),
        shipping_cost=str(order.shipping_cost),
        tax=str(order.tax),
        discount=str(order.discount),
        total=str(order.total),
        coupon_code=order.coupon_code,
        payment_session_id=payment_session_id,
        created_at=order.created_at.isoformat() if order.created_at else None,
        items=items,
    )


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create an order from the user's cart and kick off a Cashfree payment session."""
    user_id = _user_id_from_token(current_user)

    # --- user (email/phone needed for Cashfree customer_details) ---
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    # --- addresses must belong to the user ---
    shipping_address = await _get_owned_address(
        db, uuid.UUID(str(payload.shipping_address_id)), user_id, "Shipping"
    )
    billing_address = await _get_owned_address(
        db, uuid.UUID(str(payload.billing_address_id)), user_id, "Billing"
    )

    # --- cart items with product/variant details ---
    result = await db.execute(
        select(CartItem, Product, ProductVariant)
        .join(Product, Product.id == CartItem.product_id)
        .outerjoin(ProductVariant, ProductVariant.id == CartItem.variant_id)
        .where(CartItem.user_id == user_id)
    )
    cart_rows = result.all()
    if not cart_rows:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty"
        )

    # --- totals ---
    subtotal = Decimal("0.00")
    for cart_item, product, variant in cart_rows:
        unit_price = product.price + (variant.price_adjustment if variant else Decimal("0.00"))
        subtotal += unit_price * cart_item.quantity
    subtotal = _round_money(subtotal)

    shipping_cost = Decimal("0.00") if subtotal > FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
    tax = _round_money((subtotal + shipping_cost) * GST_RATE)
    discount = Decimal("0.00")
    total = _round_money(subtotal + shipping_cost + tax - discount)

    # --- order + items + payment record ---
    order = Order(
        user_id=user_id,
        status="pending",
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        tax=tax,
        discount=discount,
        total=total,
        coupon_code=payload.coupon_code,
        shipping_address_id=shipping_address.id,
        billing_address_id=billing_address.id,
    )
    db.add(order)
    await db.flush()

    order_items: list[OrderItem] = []
    for cart_item, product, variant in cart_rows:
        unit_price = product.price + (variant.price_adjustment if variant else Decimal("0.00"))
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            variant_id=cart_item.variant_id,
            quantity=cart_item.quantity,
            unit_price=_round_money(unit_price),
            total_price=_round_money(unit_price * cart_item.quantity),
        )
        db.add(order_item)
        order_items.append(order_item)

    payment = Payment(
        order_id=order.id,
        method="cashfree",
        status="pending",
        amount=total,
        created_at=datetime.now(timezone.utc),
    )
    db.add(payment)

    # --- cashfree payment session ---
    payment_session_id = await cashfree.create_order(
        order, customer_email=user.email, customer_phone=user.phone or ""
    )
    # Persist the session id (Payment.transaction_id is the closest free slot;
    # the webhook overwrites it with the real transaction reference later).
    if payment_session_id:
        payment.transaction_id = payment_session_id

    # --- clear the cart ---
    await db.execute(delete(CartItem).where(CartItem.user_id == user_id))
    await db.flush()

    items = [
        OrderItemResponse(
            id=str(item.id),
            product_id=str(item.product_id),
            variant_id=str(item.variant_id) if item.variant_id else None,
            product_name=product.name,
            product_slug=product.slug,
            quantity=item.quantity,
            unit_price=str(item.unit_price),
            total_price=str(item.total_price),
        )
        for item, (_, product, _) in zip(order_items, cart_rows)
    ]
    return _serialize_order(order, items, payment_session_id=payment_session_id)


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's orders, newest first."""
    user_id = _user_id_from_token(current_user)
    result = await db.execute(
        select(Order)
        .where(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    response: list[OrderResponse] = []
    for order in orders:
        items = await _load_order_items(db, order.id)
        response.append(_serialize_order(order, items))
    return response


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single order (with items) owned by the current user."""
    user_id = _user_id_from_token(current_user)
    result = await db.execute(
        select(Order).where(Order.id == uuid.UUID(str(order_id)), Order.user_id == user_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    items = await _load_order_items(db, order.id)

    # payment_session_id was persisted on the payment row at order creation.
    result = await db.execute(select(Payment).where(Payment.order_id == order.id))
    payment = result.scalar_one_or_none()
    payment_session_id = payment.transaction_id if payment else None

    return _serialize_order(order, items, payment_session_id=payment_session_id)
