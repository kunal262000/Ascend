"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-08-31

This is the ASCEND baseline migration. It creates the full schema that matches
the SQLAlchemy models in app/models, including the `is_admin` column on users
(added in the admin API work).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _uuid_pk() -> postgresql.UUID:
    return postgresql.UUID(as_uuid=True)


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "categories",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(length=500), nullable=True),
    )

    op.create_table(
        "products",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("compare_at_price", sa.Numeric(10, 2), nullable=True),
        sa.Column("cost_price", sa.Numeric(10, 2), nullable=True),
        sa.Column("sku", sa.String(length=100), nullable=False, unique=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("category_id", _uuid_pk(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "product_images",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    op.create_table(
        "product_variants",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("size", sa.String(length=50), nullable=False),
        sa.Column("color", sa.String(length=50), nullable=False),
        sa.Column("sku", sa.String(length=100), nullable=False, unique=True),
        sa.Column("price_adjustment", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("stock", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )

    op.create_table(
        "addresses",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("user_id", _uuid_pk(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("line1", sa.String(length=255), nullable=False),
        sa.Column("line2", sa.String(length=255), nullable=True),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("pincode", sa.String(length=10), nullable=False),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    op.create_table(
        "orders",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("user_id", _uuid_pk(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default=sa.text("'pending'")),
        sa.Column("subtotal", sa.Numeric(10, 2), nullable=False),
        sa.Column("shipping_cost", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("tax", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("discount", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("total", sa.Numeric(10, 2), nullable=False),
        sa.Column("coupon_code", sa.String(length=100), nullable=True),
        sa.Column("shipping_address_id", _uuid_pk(), sa.ForeignKey("addresses.id"), nullable=False),
        sa.Column("billing_address_id", _uuid_pk(), sa.ForeignKey("addresses.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "order_items",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("order_id", _uuid_pk(), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("variant_id", _uuid_pk(), sa.ForeignKey("product_variants.id"), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("total_price", sa.Numeric(10, 2), nullable=False),
    )

    op.create_table(
        "payments",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("order_id", _uuid_pk(), sa.ForeignKey("orders.id"), nullable=False, unique=True),
        sa.Column("method", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default=sa.text("'pending'")),
        sa.Column("transaction_id", sa.String(length=255), nullable=True),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "cart_items",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("user_id", _uuid_pk(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("session_id", sa.String(), nullable=True),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("variant_id", _uuid_pk(), sa.ForeignKey("product_variants.id"), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "inventory_log",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("variant_id", _uuid_pk(), sa.ForeignKey("product_variants.id"), nullable=False),
        sa.Column("change", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "wishlist_items",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("user_id", _uuid_pk(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )

    op.create_table(
        "reviews",
        sa.Column("id", _uuid_pk(), primary_key=True),
        sa.Column("user_id", _uuid_pk(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("product_id", _uuid_pk(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("is_approved", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_review_rating_range"),
    )


def downgrade() -> None:
    op.drop_table("reviews")
    op.drop_table("wishlist_items")
    op.drop_table("inventory_log")
    op.drop_table("cart_items")
    op.drop_table("payments")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("addresses")
    op.drop_table("product_variants")
    op.drop_table("product_images")
    op.drop_table("products")
    op.drop_table("categories")
    op.drop_table("users")
