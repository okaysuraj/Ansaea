from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
import uuid

from app.models.models import DoctorOut, AppointmentCreate, AppointmentOut
from app.models.db_models import User, DoctorProfile, Appointment
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/api/psychiatrists", tags=["Psychiatrists"])

@router.get("", response_model=List[DoctorOut])
async def list_psychiatrists(db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.role == 'doctor').options(selectinload(User.doctor_profile))
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    doctors = []
    for user in users:
        if user.doctor_profile:
            doctors.append({
                "id": user.id,
                "name": user.username,
                "specialty": user.doctor_profile.specialty,
                "bio": user.doctor_profile.bio,
                "rating": user.doctor_profile.rating,
                "experience_years": user.doctor_profile.experience_years,
                "imageUrl": user.doctor_profile.image_url,
                "session_price": user.doctor_profile.session_price,
                "availability_slots": user.doctor_profile.availability_slots
            })
    return doctors

@router.post("/book", response_model=Dict[str, Any])
async def book_appointment(appt_in: AppointmentCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # 1. Verify doctor exists
    stmt_doc = select(User).where(User.id == appt_in.doctor_id, User.role == 'doctor').options(selectinload(User.doctor_profile))
    doctor = (await db.execute(stmt_doc)).scalar_one_or_none()
    
    if not doctor or not doctor.doctor_profile:
        raise HTTPException(status_code=404, detail="Psychiatrist not found")
        
    # 2. Check if the slot is already booked for this doctor
    stmt_clash = select(Appointment).where(
        Appointment.doctor_id == appt_in.doctor_id,
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
        doctor_id=doctor.id,
        doctor_name=doctor.username,
        doctor_specialty=doctor.doctor_profile.specialty,
        doctor_imageUrl=doctor.doctor_profile.image_url,
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
    if current_user.role == 'doctor':
        stmt = select(Appointment).where(Appointment.doctor_id == current_user.id).order_by(Appointment.date.asc(), Appointment.time_slot.asc())
    else:
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

    # Both patient and doctor can cancel
    stmt = select(Appointment).where(
        Appointment.id == appt_uuid, 
        or_(Appointment.user_id == current_user.id, Appointment.doctor_id == current_user.id)
    )
    appt = (await db.execute(stmt)).scalar_one_or_none()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized")
        
    appt.status = "cancelled"
    await db.commit()
        
    return {"status": "success", "message": "Appointment cancelled successfully"}
