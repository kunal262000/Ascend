import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.address import Address
from app.schemas.user import AddressCreate, AddressResponse, AddressUpdate

router = APIRouter(prefix="/users/me/addresses", tags=["addresses"])


def _user_id_from_token(current_user: dict) -> uuid.UUID:
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return uuid.UUID(str(user_id))


def _serialize(address: Address) -> AddressResponse:
    return AddressResponse(
        id=str(address.id),
        user_id=str(address.user_id),
        type=address.type,
        full_name=address.full_name,
        phone=address.phone,
        line1=address.line1,
        line2=address.line2,
        city=address.city,
        state=address.state,
        pincode=address.pincode,
        is_default=address.is_default,
    )


async def _get_owned_address(db: AsyncSession, address_id: uuid.UUID, user_id: uuid.UUID) -> Address:
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user_id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )
    return address


async def _unset_default(db: AsyncSession, user_id: uuid.UUID) -> None:
    """Clear the is_default flag on all of the user's addresses."""
    result = await db.execute(
        select(Address).where(Address.user_id == user_id, Address.is_default == True)  # noqa: E712
    )
    for address in result.scalars().all():
        address.is_default = False


@router.get("", response_model=list[AddressResponse])
async def list_addresses(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's saved addresses."""
    user_id = _user_id_from_token(current_user)
    result = await db.execute(
        select(Address)
        .where(Address.user_id == user_id)
        .order_by(Address.is_default.desc())
    )
    return [_serialize(address) for address in result.scalars().all()]


@router.post("", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(
    payload: AddressCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new address for the current user."""
    user_id = _user_id_from_token(current_user)

    result = await db.execute(select(Address).where(Address.user_id == user_id))
    existing = result.scalars().all()

    make_default = payload.is_default or len(existing) == 0
    if make_default:
        await _unset_default(db, user_id)

    address = Address(
        user_id=user_id,
        type=payload.type,
        full_name=payload.full_name,
        phone=payload.phone,
        line1=payload.line1,
        line2=payload.line2,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
        is_default=make_default,
    )
    db.add(address)
    await db.flush()
    return _serialize(address)


@router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: str,
    payload: AddressUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing address owned by the current user."""
    user_id = _user_id_from_token(current_user)
    address = await _get_owned_address(db, uuid.UUID(str(address_id)), user_id)

    if payload.is_default is True and not address.is_default:
        await _unset_default(db, user_id)

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(address, field, value)

    await db.flush()
    return _serialize(address)


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(
    address_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an address owned by the current user."""
    user_id = _user_id_from_token(current_user)
    address = await _get_owned_address(db, uuid.UUID(str(address_id)), user_id)
    await db.delete(address)
