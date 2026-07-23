from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.models.db_models import User, DoctorProfile, SystemSettings, AuditLog
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["Admin"])

class SettingUpdate(BaseModel):
    setting_value: bool

@router.get("/approvals")
async def get_doctor_approvals(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    stmt = select(User).where(User.role == 'doctor').options(selectinload(User.doctor_profile))
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    doctors = []
    for user in users:
        if user.doctor_profile:
            doctors.append({
                "id": str(user.id),
                "name": user.username,
                "specialty": user.doctor_profile.specialty,
                "license": user.doctor_profile.license_number or "N/A",
                "status": user.doctor_profile.status
            })
    return doctors

@router.patch("/approvals/{doctor_id}")
async def update_doctor_status(doctor_id: str, status_update: Dict[str, str], current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    stmt = select(User).where(User.id == doctor_id, User.role == 'doctor').options(selectinload(User.doctor_profile))
    user = (await db.execute(stmt)).scalar_one_or_none()
    
    if not user or not user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    user.doctor_profile.status = status_update.get("status", "pending")
    
    # Audit log
    audit = AuditLog(
        action=f"Update Doctor Status: {user.doctor_profile.status}",
        actor_id=str(current_user.id),
        target_id=str(user.id),
        details={"doctor_name": user.username}
    )
    db.add(audit)
    await db.commit()
    
    return {"status": "success", "message": f"Doctor status updated to {user.doctor_profile.status}"}

@router.get("/system-health")
async def get_system_health(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    # Get active users count
    stmt = select(func.count(User.id))
    user_count = (await db.execute(stmt)).scalar()
    
    return {
        "uptime": "99.99%",
        "active_users": user_count
    }

@router.get("/settings")
async def get_settings(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
        
    stmt = select(SystemSettings)
    settings = (await db.execute(stmt)).scalars().all()
    
    setting_dict = {s.setting_key: s.setting_value for s in settings}
    return {
        "hipaa_mode": setting_dict.get("hipaa_mode", True),
        "gdpr_mode": setting_dict.get("gdpr_mode", True)
    }

@router.patch("/settings/{key}")
async def update_setting(key: str, update: SettingUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
        
    stmt = select(SystemSettings).where(SystemSettings.setting_key == key)
    setting = (await db.execute(stmt)).scalar_one_or_none()
    
    if setting:
        setting.setting_value = update.setting_value
    else:
        setting = SystemSettings(setting_key=key, setting_value=update.setting_value)
        db.add(setting)
        
    # Audit log
    audit = AuditLog(
        action=f"Changed {key} to {update.setting_value}",
        actor_id=str(current_user.id)
    )
    db.add(audit)
    
    await db.commit()
    return {"status": "success", "message": f"{key} updated"}

@router.get("/audit-logs")
async def get_audit_logs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "super_admin" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
        
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50)
    result = await db.execute(stmt)
    logs = result.scalars().all()
    
    return [{
        "id": str(log.id),
        "action": log.action,
        "actor": log.actor_id, # In a real app, join with User table to get name
        "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for log in logs]
