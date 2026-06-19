from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.models import PsychiatristOut, AppointmentCreate, AppointmentOut
from app.db_models import Psychiatrist, Appointment
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/api/psychiatrists", tags=["Psychiatrists"])

@router.get("", response_model=List[PsychiatristOut])
async def list_psychiatrists(db: AsyncSession = Depends(get_db)):
    stmt = select(Psychiatrist)
    result = await db.execute(stmt)
    doctors = result.scalars().all()
    return doctors

@router.post("/book", response_model=Dict[str, Any])
async def book_appointment(appt_in: AppointmentCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # 1. Verify doctor exists
    stmt_doc = select(Psychiatrist).where(Psychiatrist.id == appt_in.psychiatrist_id)
    doctor = (await db.execute(stmt_doc)).scalar_one_or_none()
    if not doctor:
        raise HTTPException(status_code=404, detail="Psychiatrist not found")
        
    # 2. Check if the slot is already booked for this doctor
    stmt_clash = select(Appointment).where(
        Appointment.psychiatrist_id == appt_in.psychiatrist_id,
        Appointment.date == appt_in.date,
        Appointment.time_slot == appt_in.time_slot,
        Appointment.status == "upcoming"
    )
    clash = (await db.execute(stmt_clash)).scalar_one_or_none()
    if clash:
        raise HTTPException(status_code=400, detail="This time slot is already booked by another user")
        
    # 3. Create the booking document
    new_appt = Appointment(
        user_id=current_user.id,
        psychiatrist_id=doctor.id,
        doctor_name=doctor.name,
        doctor_specialty=doctor.specialty,
        doctor_imageUrl=doctor.imageUrl,
        date=appt_in.date,
        time_slot=appt_in.time_slot,
        session_type=appt_in.session_type,
        status="upcoming"
    )
    db.add(new_appt)
    await db.commit()
    await db.refresh(new_appt)
    
    return {
        "status": "success",
        "message": "Appointment booked successfully",
        "appointment_id": str(new_appt.id)
    }

@router.get("/appointments", response_model=List[AppointmentOut])
async def list_appointments(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Appointment).where(Appointment.user_id == current_user.id).order_by(Appointment.date.desc())
    result = await db.execute(stmt)
    appointments = result.scalars().all()
    return appointments

@router.post("/appointments/{appt_id}/cancel", response_model=Dict[str, Any])
async def cancel_appointment(appt_id: str, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appt_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Appointment ID")

    stmt = select(Appointment).where(Appointment.id == appt_uuid, Appointment.user_id == current_user.id)
    appt = (await db.execute(stmt)).scalar_one_or_none()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized")
        
    appt.status = "cancelled"
    await db.commit()
        
    return {"status": "success", "message": "Appointment cancelled successfully"}
