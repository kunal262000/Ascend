from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.product import Category, Product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.is_active == True)

    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if category:
        query = query.join(Category).where(Category.slug == category)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()

    return {
        "items": [
            {
                "id": str(p.id),
                "name": p.name,
                "slug": p.slug,
                "description": p.description,
                "price": str(p.price),
                "compare_at_price": str(p.compare_at_price) if p.compare_at_price else None,
                "sku": p.sku,
                "is_active": p.is_active,
                "category_id": str(p.category_id),
                "created_at": p.created_at.isoformat() if p.created_at else None,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in products
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/{slug}")
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.slug == slug, Product.is_active == True))
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {
        "id": str(product.id),
        "name": product.name,
        "slug": product.slug,
        "description": product.description,
        "price": str(product.price),
        "compare_at_price": str(product.compare_at_price) if product.compare_at_price else None,
        "sku": product.sku,
        "is_active": product.is_active,
        "category_id": str(product.category_id),
        "created_at": product.created_at.isoformat() if product.created_at else None,
        "updated_at": product.updated_at.isoformat() if product.updated_at else None,
    }


@router.get("/categories", tags=["categories"])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "image_url": c.image_url,
        }
        for c in categories
    ]
