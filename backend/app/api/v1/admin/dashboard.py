"""Admin dashboard statistics endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.order import Order, Payment
from app.models.product import Product
from app.models.user import User
from app.schemas.admin import AdminDashboardStats, AdminOrderListItem

router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])


@router.get("/stats", response_model=AdminDashboardStats)
async def admin_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Return aggregate dashboard metrics and the 10 most recent orders."""
    # Total revenue = sum of totals on orders whose payment is marked paid.
    revenue_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .join(Payment, Payment.order_id == Order.id)
        .where(Payment.status == "paid")
    )
    total_revenue = revenue_result.scalar_one()

    total_orders = (await db.execute(select(func.count(Order.id)))).scalar_one()
    total_products = (await db.execute(select(func.count(Product.id)))).scalar_one()
    total_customers = (await db.execute(select(func.count(User.id)))).scalar_one()

    recent = (
        await db.execute(
            select(Order).order_by(Order.created_at.desc()).limit(10)
        )
    ).scalars().all()

    recent_orders = [
        AdminOrderListItem(
            id=o.id,
            user_id=o.user_id,
            customer_email=None,
            status=o.status,
            subtotal=o.subtotal,
            shipping_cost=o.shipping_cost,
            tax=o.tax,
            discount=o.discount,
            total=o.total,
            coupon_code=o.coupon_code,
            created_at=o.created_at,
        )
        for o in recent
    ]

    return AdminDashboardStats(
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_products=total_products,
        total_customers=total_customers,
        recent_orders=recent_orders,
    )
