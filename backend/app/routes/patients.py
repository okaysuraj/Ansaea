"""Patient profiles, health records, and wearable measurements."""

from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.db_models import (
    MedicalHistory,
    MedicalRecord,
    NotificationPreferences,
    PatientProfileExt,
    User,
    VitalSign,
    WearableData,
)
from app.models.schemas import (
    MedicalHistoryCreate,
    MedicalHistoryOut,
    MedicalRecordCreate,
    MedicalRecordOut,
    NotificationPreferencesCreate,
    NotificationPreferencesOut,
    PatientProfileExtCreate,
    PatientProfileExtOut,
    VitalSignCreate,
    VitalSignOut,
)

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.post("/vitals", response_model=Dict[str, Any])
async def add_vital_sign(
    vitals_in: VitalSignCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    new_vital = VitalSign(
        user_id=current_user.id,
        blood_pressure=vitals_in.blood_pressure,
        heart_rate=vitals_in.heart_rate,
        spo2=vitals_in.spo2,
        temperature=vitals_in.temperature,
        bmi=vitals_in.bmi,
        blood_sugar=vitals_in.blood_sugar,
    )
    db.add(new_vital)
    await db.commit()
    await db.refresh(new_vital)
    return {
        "status": "success",
        "message": "Vitals logged successfully",
        "id": str(new_vital.id),
    }


@router.get("/vitals", response_model=List[VitalSignOut])
async def get_vital_signs(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(VitalSign)
        .where(VitalSign.user_id == current_user.id)
        .order_by(VitalSign.date.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/records", response_model=Dict[str, Any])
async def add_medical_record(
    record_in: MedicalRecordCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    new_record = MedicalRecord(
        user_id=current_user.id,
        title=record_in.title,
        record_type=record_in.record_type,
        file_url=record_in.file_url,
    )
    db.add(new_record)
    await db.commit()
    await db.refresh(new_record)
    return {
        "status": "success",
        "message": "Medical record added",
        "id": str(new_record.id),
    }


@router.get("/records", response_model=List[MedicalRecordOut])
async def get_medical_records(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(MedicalRecord)
        .where(MedicalRecord.user_id == current_user.id)
        .order_by(MedicalRecord.date.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


# Patient profile and preferences


@router.get("/profile", response_model=PatientProfileExtOut)
async def get_patient_profile(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = select(PatientProfileExt).where(PatientProfileExt.user_id == current_user.id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    if not profile:
        profile = PatientProfileExt(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


@router.put("/profile", response_model=PatientProfileExtOut)
async def update_patient_profile(
    profile_in: PatientProfileExtCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(PatientProfileExt).where(PatientProfileExt.user_id == current_user.id)
    result = await db.execute(stmt)
    profile = result.scalars().first()

    if not profile:
        profile = PatientProfileExt(user_id=current_user.id, **profile_in.model_dump())
        db.add(profile)
    else:
        for key, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)

    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/medical-history", response_model=MedicalHistoryOut)
async def get_medical_history(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = select(MedicalHistory).where(MedicalHistory.user_id == current_user.id)
    result = await db.execute(stmt)
    history = result.scalars().first()
    if not history:
        history = MedicalHistory(user_id=current_user.id)
        db.add(history)
        await db.commit()
        await db.refresh(history)
    return history


@router.put("/medical-history", response_model=MedicalHistoryOut)
async def update_medical_history(
    history_in: MedicalHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(MedicalHistory).where(MedicalHistory.user_id == current_user.id)
    result = await db.execute(stmt)
    history = result.scalars().first()

    dumped_data = history_in.model_dump(exclude_unset=True)
    if not history:
        history = MedicalHistory(user_id=current_user.id, **dumped_data)
        db.add(history)
    else:
        for key, value in dumped_data.items():
            setattr(history, key, value)

    await db.commit()
    await db.refresh(history)
    return history


@router.get("/notifications", response_model=NotificationPreferencesOut)
async def get_notification_prefs(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = select(NotificationPreferences).where(
        NotificationPreferences.user_id == current_user.id
    )
    result = await db.execute(stmt)
    prefs = result.scalars().first()
    if not prefs:
        prefs = NotificationPreferences(user_id=current_user.id)
        db.add(prefs)
        await db.commit()
        await db.refresh(prefs)
    return prefs


@router.put("/notifications", response_model=NotificationPreferencesOut)
async def update_notification_prefs(
    prefs_in: NotificationPreferencesCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(NotificationPreferences).where(
        NotificationPreferences.user_id == current_user.id
    )
    result = await db.execute(stmt)
    prefs = result.scalars().first()

    if not prefs:
        prefs = NotificationPreferences(
            user_id=current_user.id, **prefs_in.model_dump()
        )
        db.add(prefs)
    else:
        for key, value in prefs_in.model_dump(exclude_unset=True).items():
            setattr(prefs, key, value)

    await db.commit()
    await db.refresh(prefs)
    return prefs


@router.post("/wearable-data", response_model=Dict[str, Any])
async def log_wearable_data(
    data_in: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    val = data_in.get("measurement_value")
    float_val = None
    if val is not None:
        try:
            float_val = float(val)
        except (ValueError, TypeError):
            float_val = None

    notes = data_in.get("notes")
    if isinstance(notes, dict):
        import json

        notes = json.dumps(notes)
    elif notes is not None:
        notes = str(notes)

    wearable = WearableData(
        user_id=current_user.id,
        data_type=data_in.get("data_type", "general"),
        measurement_value=float_val,
        unit=data_in.get("unit"),
        notes=notes,
    )
    db.add(wearable)
    await db.commit()
    await db.refresh(wearable)
    return {
        "status": "success",
        "message": "Wearable data recorded",
        "id": str(wearable.id),
    }


@router.get("/wearable-data", response_model=List[Dict[str, Any]])
async def get_wearable_data(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(WearableData)
        .where(WearableData.user_id == current_user.id)
        .order_by(WearableData.recorded_at.desc())
        .limit(100)
    )
    result = await db.execute(stmt)
    records = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "data_type": r.data_type,
            "measurement_value": r.measurement_value,
            "unit": r.unit,
            "notes": r.notes,
            "recorded_at": r.recorded_at.isoformat() if r.recorded_at else None,
        }
        for r in records
    ]
