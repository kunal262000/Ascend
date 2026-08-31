"""Admin API router.

All routes under /admin are guarded by `get_current_admin_user` so only
authenticated users with `is_admin=True` can access them. Individual
sub-routers are mounted with their own prefixes (e.g. /products), and the
outer `/admin` prefix is applied when this router is included by the v1 router.
"""
from fastapi import APIRouter, Depends

from app.core.deps import get_current_admin_user
from app.api.v1.admin import dashboard, inventory, orders, products

router = APIRouter(dependencies=[Depends(get_current_admin_user)])

router.include_router(products.router)
router.include_router(orders.router)
router.include_router(dashboard.router)
router.include_router(inventory.router)

__all__ = ["router"]
