import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.cart import CartItem
from app.models.product import Product, ProductVariant
from app.schemas.user import (
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    CartProductSummary,
    CartVariantSummary,
)

router = APIRouter(prefix="/cart", tags=["cart"])


def _user_id_from_token(current_user: dict) -> uuid.UUID:
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return uuid.UUID(str(user_id))


def _serialize_cart_row(cart_item: CartItem, product: Product, variant: ProductVariant | None) -> CartItemResponse:
    unit_price = product.price
    if variant is not None:
        unit_price = unit_price + (variant.price_adjustment or 0)
    return CartItemResponse(
        id=str(cart_item.id),
        product_id=str(cart_item.product_id),
        variant_id=str(cart_item.variant_id) if cart_item.variant_id else None,
        quantity=cart_item.quantity,
        unit_price=str(unit_price),
        product=CartProductSummary(
            id=str(product.id),
            name=product.name,
            slug=product.slug,
            price=str(product.price),
        ),
        variant=(
            CartVariantSummary(
                id=str(variant.id),
                size=variant.size,
                color=variant.color,
                sku=variant.sku,
            )
            if variant is not None
            else None
        ),
    )


async def _get_cart_item(db: AsyncSession, item_id: uuid.UUID, user_id: uuid.UUID) -> CartItem:
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found"
        )
    return cart_item


@router.get("", response_model=list[CartItemResponse])
async def get_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's cart items with product/variant details."""
    user_id = _user_id_from_token(current_user)
    result = await db.execute(
        select(CartItem, Product, ProductVariant)
        .join(Product, Product.id == CartItem.product_id)
        .outerjoin(ProductVariant, ProductVariant.id == CartItem.variant_id)
        .where(CartItem.user_id == user_id)
        .order_by(CartItem.created_at)
    )
    return [_serialize_cart_row(item, product, variant) for item, product, variant in result.all()]


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_cart_item(
    payload: CartItemCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add an item to the user's cart (or bump quantity if it already exists)."""
    user_id = _user_id_from_token(current_user)
    if payload.quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Quantity must be at least 1",
        )

    product_id = uuid.UUID(str(payload.product_id))
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.is_active == True)  # noqa: E712
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    variant = None
    if payload.variant_id:
        variant_id = uuid.UUID(str(payload.variant_id))
        result = await db.execute(
            select(ProductVariant).where(
                ProductVariant.id == variant_id,
                ProductVariant.product_id == product_id,
                ProductVariant.is_active == True,  # noqa: E712
            )
        )
        variant = result.scalar_one_or_none()
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Variant not found for this product",
            )

    # Merge into an existing line when the same product+variant is already in the cart.
    result = await db.execute(
        select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
            CartItem.variant_id == (variant.id if variant else None),
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.quantity += payload.quantity
        cart_item = existing
        await db.flush()
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            variant_id=variant.id if variant else None,
            quantity=payload.quantity,
            created_at=datetime.now(timezone.utc),
        )
        db.add(cart_item)
        await db.flush()

    return _serialize_cart_row(cart_item, product, variant)


@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: str,
    payload: CartItemUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the quantity of a cart item."""
    user_id = _user_id_from_token(current_user)
    if payload.quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Quantity must be at least 1",
        )

    cart_item = await _get_cart_item(db, uuid.UUID(str(item_id)), user_id)
    cart_item.quantity = payload.quantity
    await db.flush()

    result = await db.execute(
        select(Product, ProductVariant)
        .join(Product, Product.id == cart_item.product_id)
        .outerjoin(ProductVariant, ProductVariant.id == cart_item.variant_id)
        .where(Product.id == cart_item.product_id)
    )
    product, variant = result.first()
    return _serialize_cart_row(cart_item, product, variant)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_cart_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a single item from the user's cart."""
    user_id = _user_id_from_token(current_user)
    cart_item = await _get_cart_item(db, uuid.UUID(str(item_id)), user_id)
    await db.delete(cart_item)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove all items from the user's cart."""
    user_id = _user_id_from_token(current_user)
    await db.execute(delete(CartItem).where(CartItem.user_id == user_id))
