"""Cashfree payment gateway integration.

Creates a Payment Gateway order and returns the payment_session_id used by
the frontend to render Cashfree's hosted checkout / SDK.

When CASHFREE_APP_ID / CASHFREE_SECRET_KEY are not configured (empty), the
service degrades gracefully: `create_order` returns None and the caller
continues without a payment session (useful in local dev).
"""
import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

API_VERSION = "2023-08-01"
BASE_URLS = {
    "sandbox": "https://sandbox.cashfree.com/pg",
    "production": "https://api.cashfree.com/pg",
}
DEFAULT_ENV = "sandbox"
TIMEOUT_SECONDS = 15


def get_base_url() -> str:
    """Base URL for the Cashfree PG API based on CASHFREE_ENV."""
    env = (settings.CASHFREE_ENV or DEFAULT_ENV).strip().lower()
    return BASE_URLS.get(env, BASE_URLS[DEFAULT_ENV])


def is_payment_enabled() -> bool:
    return bool(settings.CASHFREE_APP_ID and settings.CASHFREE_SECRET_KEY)


async def create_order(order, customer_email: str, customer_phone: str) -> str | None:
    """Create a Cashfree PG order and return its payment_session_id.

    Args:
        order: Order model instance (must have id, user_id, total persisted).
        customer_email: Customer email for Cashfree customer_details.
        customer_phone: Customer phone for Cashfree customer_details.

    Returns:
        payment_session_id (str) on success, None when payments are disabled
        (missing credentials) or when the Cashfree call fails.
    """
    if not is_payment_enabled():
        logger.info("Cashfree credentials not set — payment session skipped")
        return None

    payload = {
        "order_id": str(order.id),
        "order_amount": float(order.total),
        "order_currency": "INR",
        "customer_details": {
            "customer_id": str(order.user_id),
            "customer_email": customer_email,
            "customer_phone": customer_phone,
        },
    }
    headers = {
        "x-api-version": API_VERSION,
        "x-client-id": settings.CASHFREE_APP_ID,
        "x-client-secret": settings.CASHFREE_SECRET_KEY,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            response = await client.post(
                f"{get_base_url()}/orders", json=payload, headers=headers
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        logger.warning("Cashfree create_order failed: %s", exc)
        return None

    payment_session_id = data.get("payment_session_id")
    if not payment_session_id:
        logger.warning("Cashfree response missing payment_session_id: %s", data)
        return None

    return payment_session_id
