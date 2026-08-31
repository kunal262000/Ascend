"""Create the ASCEND admin user.

Usage (from the backend/ directory, with the venv active):

    python -m scripts.seed_admin

or

    python scripts/seed_admin.py

Creates (or idempotently ensures) the admin account:
    email:    admin@ascend.com
    password: admin123
"""
import asyncio

from sqlalchemy import select

from app.core.database import async_session_factory
from app.core.security import hash_password
from app.models.user import User

ADMIN_EMAIL = "admin@ascend.com"
ADMIN_PASSWORD = "admin123"
ADMIN_FULL_NAME = "ASCEND Admin"


async def ensure_admin() -> None:
    async with async_session_factory() as session:
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        user = result.scalar_one_or_none()
        if user:
            if not user.is_admin:
                user.is_admin = True
                await session.commit()
                print(f"Admin flag set on existing user {ADMIN_EMAIL}")
            else:
                print(f"Admin user already exists: {ADMIN_EMAIL}")
            return

        user = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            full_name=ADMIN_FULL_NAME,
            is_admin=True,
        )
        session.add(user)
        await session.commit()
        print(f"Created admin user: {ADMIN_EMAIL}")


if __name__ == "__main__":
    asyncio.run(ensure_admin())
