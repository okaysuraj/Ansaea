from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_user
from app.models.db_models import User, Appointment, VideoSession
import uuid
from app.services.daily_service import daily_service

router = APIRouter(prefix="/api/video", tags=["Video"])

@router.get("/room/{appointment_id}")
async def get_or_create_room(appointment_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid appointment ID format")

    # Verify user is part of the appointment
    stmt = select(Appointment).where(Appointment.id == appt_uuid)
    appt = (await db.execute(stmt)).scalar_one_or_none()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    if appt.user_id != current_user.id and appt.doctor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this room")

    # Check if a VideoSession already exists
    session_stmt = select(VideoSession).where(VideoSession.appointment_id == appt_uuid)
    video_session = (await db.execute(session_stmt)).scalar_one_or_none()
    
    if video_session:
        return {"url": video_session.room_url, "status": video_session.status}

    # If not, create one using Daily service
    room_name = f"ansaea-room-{appt_uuid.hex[:8]}"
    daily_res = daily_service.create_room(room_name=room_name)
    
    # daily_service returns a simulated or real URL
    room_url = daily_res.get("url", f"https://video.ansaea.co/{room_name}")

    video_session = VideoSession(
        appointment_id=appt_uuid,
        room_url=room_url,
        status="created"
    )
    db.add(video_session)
    await db.commit()
    await db.refresh(video_session)
    
    return {"url": video_session.room_url, "status": video_session.status}
