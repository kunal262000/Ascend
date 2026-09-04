import hashlib
import hmac
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.deps import get_db
from app.models.order import Order, Payment

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])

# Map Cashfree payment_status values to our order/payment statuses.
# Cashfree sends SUCCESS / FAILED / (pending states like PROCESSING, PENDING).
ORDER_STATUS_MAP = {
    "SUCCESS": "paid",
    "FAILED": "failed",
    "CANCELLED": "cancelled",
}


def _verify_signature(body: bytes, signature: str | None) -> bool:
    """Verify the Cashfree webhook signature (HMAC-SHA256 of the raw body).

    Uses CASHFREE_SECRET_KEY as the signing key. When credentials are not
    configured, verification is skipped (dev mode).
    """
    if not signature or not settings.CASHFREE_SECRET_KEY:
        return True
    expected = hmac.new(
        settings.CASHFREE_SECRET_KEY.encode("utf-8"),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@router.post("/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Receive Cashfree payment webhooks and update order/payment status.

    Expects a raw JSON body with at least `order_id` and `payment_status`
    (Cashfree's standard webhook envelope). Signature is verified with
    HMAC-SHA256 when credentials are configured.
    """
    body = await request.body()

    signature = request.headers.get("x-webhook-signature")
    if not _verify_signature(body, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature"
        )

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload"
        )

    order_id = payload.get("order_id")
    if not order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Missing order_id"
        )

    try:
        order_uuid = uuid.UUID(str(order_id))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order_id"
        )

    result = await db.execute(select(Order).where(Order.id == order_uuid))
    order = result.scalar_one_or_none()
    if not order:
        logger.warning("Webhook for unknown order: %s", order_id)
        return {"status": "ignored", "detail": "Order not found"}

    result = await db.execute(select(Payment).where(Payment.order_id == order_uuid))
    payment = result.scalar_one_or_none()

    payment_status = str(payload.get("payment_status", "")).upper()
    order_status = ORDER_STATUS_MAP.get(payment_status)

    if payment_status == "SUCCESS" and payment is None:
        # Order exists but no payment row (shouldn't happen) — create one.
        payment = Payment(
            order_id=order_uuid,
            method="cashfree",
            status="paid",
            amount=order.total,
            transaction_id=None,
            created_at=datetime.now(timezone.utc),
        )
        db.add(payment)

    if order_status:
        order.status = order_status
        if payment is not None:
            payment.status = "paid" if payment_status == "SUCCESS" else "failed"

    # Capture the payment gateway reference id when present.
    payment_info = payload.get("payment") or {}
    pg_reference_id = payment_info.get("pg_reference_id") or payload.get("order_id")
    if payment_status == "SUCCESS" and payment is not None and pg_reference_id:
        payment.transaction_id = str(pg_reference_id)

    await db.flush()
    logger.info(
        "Webhook processed: order=%s payment_status=%s -> order_status=%s",
        order_id,
        payment_status,
        order_status or "unchanged",
    )

    return {"status": "processed", "order_id": order_id, "order_status": order.status}
