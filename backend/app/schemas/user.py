from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None = None
    avatar_url: str | None = None
    is_admin: bool = False

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Cart ---
class CartItemCreate(BaseModel):
    product_id: str
    variant_id: str | None = None
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartProductSummary(BaseModel):
    id: str
    name: str
    slug: str
    price: str


class CartVariantSummary(BaseModel):
    id: str
    size: str
    color: str
    sku: str


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: str | None = None
    quantity: int
    unit_price: str
    product: CartProductSummary
    variant: CartVariantSummary | None = None


# --- Address ---
class AddressCreate(BaseModel):
    type: str = "shipping"  # shipping | billing
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressUpdate(BaseModel):
    type: str | None = None
    full_name: str | None = None
    phone: str | None = None
    line1: str | None = None
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    is_default: bool | None = None


class AddressResponse(BaseModel):
    id: str
    user_id: str
    type: str
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    pincode: str
    is_default: bool


# --- Order ---
class OrderCreate(BaseModel):
    shipping_address_id: str
    billing_address_id: str
    coupon_code: str | None = None


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: str | None = None
    product_name: str | None = None
    product_slug: str | None = None
    quantity: int
    unit_price: str
    total_price: str


class OrderResponse(BaseModel):
    id: str
    status: str
    subtotal: str
    shipping_cost: str
    tax: str
    discount: str
    total: str
    coupon_code: str | None = None
    payment_session_id: str | None = None
    created_at: str | None = None
    items: list[OrderItemResponse] = []


# --- Payment ---
class PaymentResponse(BaseModel):
    id: str
    order_id: str
    method: str
    status: str
    transaction_id: str | None = None
    amount: str
    created_at: str | None = None

