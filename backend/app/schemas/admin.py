"""Pydantic schemas for the ASCEND admin API."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# --- Products ---
class AdminProductImageCreate(BaseModel):
    url: str
    alt_text: str | None = None
    sort_order: int = 0
    is_primary: bool = False


class AdminProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    url: str
    alt_text: str | None = None
    sort_order: int
    is_primary: bool


class AdminProductVariantCreate(BaseModel):
    size: str
    color: str
    sku: str
    price_adjustment: Decimal = Decimal("0.00")
    stock: int = 0
    is_active: bool = True


class AdminProductVariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    product_id: uuid.UUID
    size: str
    color: str
    sku: str
    price_adjustment: Decimal
    stock: int
    is_active: bool


class AdminProductCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    category_id: uuid.UUID
    # base_price maps to the products.price column.
    base_price: Decimal
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    sku: str
    is_active: bool = True
    images: list[AdminProductImageCreate] = []
    variants: list[AdminProductVariantCreate] = []


class AdminProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    category_id: uuid.UUID | None = None
    # base_price maps to the products.price column.
    base_price: Decimal | None = None
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    sku: str | None = None
    is_active: bool | None = None


class AdminProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None
    price: Decimal
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    sku: str
    is_active: bool
    category_id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AdminProductDetail(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None
    price: Decimal
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    sku: str
    is_active: bool
    category_id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None
    images: list[AdminProductImageResponse] = []
    variants: list[AdminProductVariantResponse] = []


class AdminProductListResponse(BaseModel):
    items: list[AdminProductListItem]
    total: int
    page: int
    limit: int


# --- Orders ---
OrderStatus = Literal["pending", "confirmed", "shipped", "delivered", "cancelled"]

VALID_ORDER_STATUSES: set[str] = {
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
}


class AdminOrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    variant_id: uuid.UUID | None = None
    product_name: str | None = None
    product_slug: str | None = None
    quantity: int
    unit_price: Decimal
    total_price: Decimal


class AdminAddressResponse(BaseModel):
    id: uuid.UUID
    type: str
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    pincode: str


class AdminPaymentResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    method: str
    status: str
    transaction_id: str | None = None
    amount: Decimal
    created_at: datetime | None = None


class AdminOrderListItem(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    customer_email: str | None = None
    status: str
    subtotal: Decimal
    shipping_cost: Decimal
    tax: Decimal
    discount: Decimal
    total: Decimal
    coupon_code: str | None = None
    created_at: datetime | None = None


class AdminOrderDetail(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    customer_email: str | None = None
    status: str
    subtotal: Decimal
    shipping_cost: Decimal
    tax: Decimal
    discount: Decimal
    total: Decimal
    coupon_code: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    items: list[AdminOrderItemResponse] = []
    shipping_address: AdminAddressResponse | None = None
    billing_address: AdminAddressResponse | None = None
    payment: AdminPaymentResponse | None = None


class AdminOrderListResponse(BaseModel):
    items: list[AdminOrderListItem]
    total: int
    page: int
    limit: int


class AdminOrderStatusUpdate(BaseModel):
    status: OrderStatus


# --- Dashboard ---
class AdminDashboardStats(BaseModel):
    total_revenue: Decimal
    total_orders: int
    total_products: int
    total_customers: int
    recent_orders: list[AdminOrderListItem]


# --- Inventory ---
class AdminInventoryItem(BaseModel):
    id: uuid.UUID  # product_variants.id (acts as the inventory record)
    product_id: uuid.UUID
    product_name: str
    product_slug: str
    product_sku: str
    size: str
    color: str
    sku: str
    stock: int
    price_adjustment: Decimal
    variant_is_active: bool


class AdminInventoryUpdate(BaseModel):
    stock_quantity: int = Field(ge=0)
