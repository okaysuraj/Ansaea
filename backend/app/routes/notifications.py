from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.models.db_models import User, Notification
from app.models.models import NotificationOut
import uuid

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
async def get_notifications(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    # Generate some mock notifications if empty, just to demonstrate the UI
    if not notifications:
        mocks = [
            Notification(user_id=current_user.id, title="New Appointment", message="You have a new consultation scheduled for tomorrow at 10:00 AM.", type="appointment"),
            Notification(user_id=current_user.id, title="Health Alert", message="Your recent blood pressure reading is elevated.", type="health_alert"),
            Notification(user_id=current_user.id, title="System Update", message="Ansaea app has been updated with new features.", type="system"),
        ]
        db.add_all(mocks)
        await db.commit()
        
        # Refetch
        result = await db.execute(stmt)
        notifications = result.scalars().all()

    return notifications

@router.put("/read-all", response_model=Dict[str, Any])
async def mark_all_read(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = update(Notification).where(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).values(is_read=True)
    
    await db.execute(stmt)
    await db.commit()
    return {"status": "success", "message": "All notifications marked as read."}
