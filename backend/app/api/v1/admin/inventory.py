"""Admin inventory management endpoints.

Stock levels live on `product_variants.stock`; each variant acts as a single
inventory record keyed by its id (the `inventory_id` used in the PATCH route).
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.inventory import InventoryLog
from app.models.product import Product, ProductVariant
from app.schemas.admin import AdminInventoryItem, AdminInventoryUpdate

router = APIRouter(prefix="/inventory", tags=["admin-inventory"])


@router.get("", response_model=dict)
async def admin_list_inventory(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    low_stock_only: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """List inventory (product variants) with product info and stock levels."""
    query = (
        select(ProductVariant, Product)
        .join(Product, Product.id == ProductVariant.product_id)
        .order_by(Product.created_at.desc(), ProductVariant.color, ProductVariant.size)
    )
    if low_stock_only:
        query = query.where(ProductVariant.stock <= 5)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    result = await db.execute(
        query.offset((page - 1) * limit).limit(limit)
    )
    rows = result.all()

    items: list[AdminInventoryItem] = [
        AdminInventoryItem(
            id=variant.id,
            product_id=variant.product_id,
            product_name=product.name,
            product_slug=product.slug,
            product_sku=product.sku,
            size=variant.size,
            color=variant.color,
            sku=variant.sku,
            stock=variant.stock,
            price_adjustment=variant.price_adjustment,
            variant_is_active=variant.is_active,
        )
        for variant, product in rows
    ]
    return {"items": items, "total": total, "page": page, "limit": limit}


@router.patch("/{inventory_id}", response_model=AdminInventoryItem)
async def admin_update_inventory(
    inventory_id: str,
    payload: AdminInventoryUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update the stock quantity for a product variant.

    `inventory_id` is the product_variants.id. The change is also logged to the
    inventory_log table.
    """
    variant = await db.get(ProductVariant, uuid.UUID(str(inventory_id)))
    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found"
        )
    variant.stock = payload.stock_quantity
    db.add(
        InventoryLog(
            variant_id=variant.id,
            change=payload.stock_quantity,
            reason="admin_update",
            created_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()

    product = await db.get(Product, variant.product_id)
    return AdminInventoryItem(
        id=variant.id,
        product_id=variant.product_id,
        product_name=product.name if product else "",
        product_slug=product.slug if product else "",
        product_sku=product.sku if product else "",
        size=variant.size,
        color=variant.color,
        sku=variant.sku,
        stock=variant.stock,
        price_adjustment=variant.price_adjustment,
        variant_is_active=variant.is_active,
    )
