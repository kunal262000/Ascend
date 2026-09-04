"""Admin product management endpoints."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_db
from app.models.product import Category, Product, ProductImage, ProductVariant
from app.schemas.admin import (
    AdminProductCreate,
    AdminProductDetail,
    AdminProductListItem,
    AdminProductListResponse,
    AdminProductUpdate,
    AdminProductVariantCreate,
)

router = APIRouter(prefix="/products", tags=["admin-products"])


async def _get_product_or_404(db: AsyncSession, product_id) -> Product:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return product


def _list_item(p: Product) -> AdminProductListItem:
    return AdminProductListItem(
        id=p.id,
        name=p.name,
        slug=p.slug,
        description=p.description,
        price=p.price,
        compare_at_price=p.compare_at_price,
        cost_price=p.cost_price,
        sku=p.sku,
        is_active=p.is_active,
        category_id=p.category_id,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.get("", response_model=AdminProductListResponse)
async def admin_list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    include_inactive: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """List ALL products (including inactive) with pagination, search, and category filter."""
    query = select(Product)
    if not include_inactive:
        query = query.where(Product.is_active.is_(True))
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if category:
        try:
            category_uuid = category
            query = query.where(Product.category_id == category_uuid)
        except Exception:
            pass

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    result = await db.execute(
        query.order_by(Product.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )
    products = result.scalars().all()

    return AdminProductListResponse(
        items=[_list_item(p) for p in products],
        total=total,
        page=page,
        limit=limit,
    )


@router.post(
    "",
    response_model=AdminProductDetail,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_product(
    payload: AdminProductCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a product with optional images and variants."""
    category = await db.get(Category, payload.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found"
        )

    existing = await db.execute(
        select(Product).where(
            (Product.slug == payload.slug) | (Product.sku == payload.sku)
        )
    )
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A product with this slug or SKU already exists",
        )

    product = Product(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        price=payload.base_price,
        compare_at_price=payload.compare_at_price,
        cost_price=payload.cost_price,
        sku=payload.sku,
        is_active=payload.is_active,
        category_id=payload.category_id,
    )
    db.add(product)
    await db.flush()

    for img in payload.images:
        db.add(
            ProductImage(
                product_id=product.id,
                url=img.url,
                alt_text=img.alt_text,
                sort_order=img.sort_order,
                is_primary=img.is_primary,
            )
        )

    for v in payload.variants:
        db.add(
            ProductVariant(
                product_id=product.id,
                size=v.size,
                color=v.color,
                sku=v.sku,
                price_adjustment=v.price_adjustment,
                stock=v.stock,
                is_active=v.is_active,
            )
        )

    await db.flush()
    return await _load_detail(db, product.id)


@router.get("/{product_id}", response_model=AdminProductDetail)
async def admin_get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single product with all images and variants joined."""
    return await _load_detail(db, product_id)


@router.put("/{product_id}", response_model=AdminProductDetail)
async def admin_update_product(
    product_id: str,
    payload: AdminProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update product fields (partial update)."""
    product = await _get_product_or_404(db, product_id)

    updates = payload.model_dump(exclude_unset=True)
    if "base_price" in updates:
        updates["price"] = updates.pop("base_price")
    for key, value in updates.items():
        setattr(product, key, value)

    if "category_id" in updates and updates["category_id"] is not None:
        category = await db.get(Category, updates["category_id"])
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found"
            )

    product.updated_at = datetime.now(timezone.utc)
    await db.flush()
    return await _load_detail(db, product.id)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def admin_soft_delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a product by setting is_active=False."""
    product = await _get_product_or_404(db, product_id)
    product.is_active = False
    product.updated_at = datetime.now(timezone.utc)
    await db.flush()
    return {"id": str(product.id), "is_active": product.is_active}


async def _load_detail(db: AsyncSession, product_id: str) -> AdminProductDetail:
    result = await db.execute(
        select(Product)
        .options(
            selectinload(Product.images),
            selectinload(Product.variants),
        )
        .where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return AdminProductDetail(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        compare_at_price=product.compare_at_price,
        cost_price=product.cost_price,
        sku=product.sku,
        is_active=product.is_active,
        category_id=product.category_id,
        created_at=product.created_at,
        updated_at=product.updated_at,
        images=list(product.images),
        variants=list(product.variants),
    )
