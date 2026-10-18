"""Account registration, profiles, and linked health identifiers."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user, get_registration_user
from app.database import get_db
from app.models.db_models import DoctorProfile, User

router = APIRouter(prefix="/api/users", tags=["Users"])


class RegisterRequest(BaseModel):
    username: str
    role: str


@router.post("/register")
async def register_user(
    data: RegisterRequest,
    current_user: User = Depends(get_registration_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Updates the implicitly created user with the correct role and username
    chosen during the signup process.
    """
    current_user.username = data.username

    # Enforce strict role safety: self-registration cannot grant admin or operational privileges
    allowed_roles = {"patient", "doctor"}
    requested_role = (data.role or "patient").lower().strip()
    if requested_role in allowed_roles:
        current_user.role = requested_role
    else:
        current_user.role = "patient"

    if current_user.role == "doctor":
        # Create a default DoctorProfile if not already present
        stmt_profile = select(DoctorProfile).where(
            DoctorProfile.user_id == current_user.id
        )
        existing_profile = (await db.execute(stmt_profile)).scalar_one_or_none()
        if not existing_profile:
            profile = DoctorProfile(user_id=current_user.id)
            db.add(profile)

    await db.commit()
    await db.refresh(current_user)
    return {
        "message": "User registered successfully",
        "user": {"username": current_user.username, "role": current_user.role},
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the current logged-in user's profile information.
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "abha_number": current_user.abha_number,
        "wallet_balance": current_user.wallet_balance,
    }


class LinkABHARequest(BaseModel):
    abha_number: str


@router.post("/link-abha")
async def link_abha(
    data: LinkABHARequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Links an ABHA ID (India's National Health ID)
    """
    current_user.abha_number = data.abha_number
    await db.commit()
    return {
        "message": "ABHA linked successfully",
        "abha_number": current_user.abha_number,
    }


class WearableSyncRequest(BaseModel):
    device_type: str  # AppleHealth, Fitbit
    data: dict  # e.g. {"steps": 5000, "heart_rate": 72}


@router.post("/sync-wearable")
async def sync_wearable(
    data: WearableSyncRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from datetime import datetime

    from app.models.db_models import WearableData

    # Store simulated wearable data
    for key, value in data.data.items():
        w_data = WearableData(
            user_id=current_user.id,
            device_type=data.device_type,
            data_type=key,
            value=str(value),
            recorded_at=datetime.utcnow(),
        )
        db.add(w_data)

    await db.commit()
    return {"message": "Wearable data synced successfully"}


@router.get("/emergency-contacts")
async def get_emergency_contacts(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """
    Returns global and user-specific emergency contacts.
    """
    from app.models.db_models import GlobalEmergencyContact

    stmt = select(GlobalEmergencyContact)
    result = await db.execute(stmt)
    contacts = result.scalars().all()

    return [{"name": c.name, "phone": c.phone, "type": c.type} for c in contacts]
