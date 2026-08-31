"""Admin order management endpoints."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_db
from app.models.address import Address
from app.models.order import Order, OrderItem, Payment
from app.models.product import Product
from app.models.user import User
from app.schemas.admin import (
    AdminAddressResponse,
    AdminOrderDetail,
    AdminOrderItemResponse,
    AdminOrderListItem,
    AdminOrderListResponse,
    AdminOrderStatusUpdate,
    AdminPaymentResponse,
    VALID_ORDER_STATUSES,
)

router = APIRouter(prefix="/orders", tags=["admin-orders"])


def _list_item(order: Order) -> AdminOrderListItem:
    return AdminOrderListItem(
        id=order.id,
        user_id=order.user_id,
        customer_email=getattr(order, "_customer_email", None),
        status=order.status,
        subtotal=order.subtotal,
        shipping_cost=order.shipping_cost,
        tax=order.tax,
        discount=order.discount,
        total=order.total,
        coupon_code=order.coupon_code,
        created_at=order.created_at,
    )


@router.get("", response_model=AdminOrderListResponse)
async def admin_list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: str | None = Query(None, alias="status"),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List all orders with pagination, optional status filter, and id search."""
    query = select(Order)
    if status_filter:
        if status_filter not in VALID_ORDER_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of {sorted(VALID_ORDER_STATUSES)}",
            )
        query = query.where(Order.status == status_filter)
    if search:
        try:
            query = query.where(Order.id == uuid.UUID(str(search)))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid order id format",
            )

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    result = await db.execute(
        query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )
    orders = result.scalars().all()

    # Attach customer emails for display.
    user_ids = {o.user_id for o in orders}
    email_map: dict[uuid.UUID, str] = {}
    if user_ids:
        users = (
            await db.execute(select(User).where(User.id.in_(user_ids)))
        ).scalars().all()
        email_map = {u.id: u.email for u in users}
    for o in orders:
        o._customer_email = email_map.get(o.user_id)

    return AdminOrderListResponse(
        items=[_list_item(o) for o in orders],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{order_id}", response_model=AdminOrderDetail)
async def admin_get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single order with its items, addresses, and payment."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == uuid.UUID(str(order_id)))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    # Customer
    customer = await db.get(User, order.user_id)

    # Addresses
    addresses = (
        await db.execute(
            select(Address).where(Address.id.in_([order.shipping_address_id, order.billing_address_id]))
        )
    ).scalars().all()
    address_map = {a.id: a for a in addresses}

    # Payment
    payment_result = await db.execute(select(Payment).where(Payment.order_id == order.id))
    payment = payment_result.scalar_one_or_none()

    # Items with product details
    item_rows = (
        await db.execute(
            select(OrderItem, Product)
            .join(Product, Product.id == OrderItem.product_id)
            .where(OrderItem.order_id == order.id)
        )
    ).all()
    items = [
        AdminOrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            variant_id=item.variant_id,
            product_name=product.name,
            product_slug=product.slug,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price,
        )
        for item, product in item_rows
    ]

    shipping = address_map.get(order.shipping_address_id)
    billing = address_map.get(order.billing_address_id)

    return AdminOrderDetail(
        id=order.id,
        user_id=order.user_id,
        customer_email=customer.email if customer else None,
        status=order.status,
        subtotal=order.subtotal,
        shipping_cost=order.shipping_cost,
        tax=order.tax,
        discount=order.discount,
        total=order.total,
        coupon_code=order.coupon_code,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items,
        shipping_address=_addr(shipping),
        billing_address=_addr(billing),
        payment=_pay(payment),
    )


@router.patch("/{order_id}/status", response_model=AdminOrderDetail)
async def admin_update_order_status(
    order_id: str,
    payload: AdminOrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an order's status (pending/confirmed/shipped/delivered/cancelled)."""
    result = await db.execute(
        select(Order).where(Order.id == uuid.UUID(str(order_id)))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    order.status = payload.status
    await db.flush()
    return await admin_get_order(order_id, db)


def _addr(a: Address | None) -> AdminAddressResponse | None:
    if not a:
        return None
    return AdminAddressResponse(
        id=a.id,
        type=a.type,
        full_name=a.full_name,
        phone=a.phone,
        line1=a.line1,
        line2=a.line2,
        city=a.city,
        state=a.state,
        pincode=a.pincode,
    )


def _pay(p: Payment | None) -> AdminPaymentResponse | None:
    if not p:
        return None
    return AdminPaymentResponse(
        id=p.id,
        order_id=p.order_id,
        method=p.method,
        status=p.status,
        transaction_id=p.transaction_id,
        amount=p.amount,
        created_at=p.created_at,
    )
