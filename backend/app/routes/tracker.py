from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.models.models import MoodLogCreate, MoodLogOut, CBTLogCreate, CBTLogOut, HabitLogCreate, HabitLogOut, VitalSignCreate, VitalSignOut, MedicalRecordCreate, MedicalRecordOut
from app.models.db_models import MoodLog, CBTLog, HabitLog, VitalSign, MedicalRecord
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/api/tracker", tags=["Tracker"])

# --- Mood & Journal Endpoints ---

@router.post("/mood", response_model=Dict[str, Any])
async def log_mood(mood_in: MoodLogCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Check if a log already exists for this date for this user
    stmt = select(MoodLog).where(MoodLog.user_id == current_user.id, MoodLog.date == mood_in.date)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    
    if existing:
        existing.mood_rating = mood_in.mood_rating
        existing.mood_type = mood_in.mood_type
        existing.journal_entry = mood_in.journal_entry
        existing.sleep_hours = mood_in.sleep_hours
        existing.water_intake = mood_in.water_intake
        existing.stress_level = mood_in.stress_level
        await db.commit()
        return {"status": "success", "message": "Mood log updated successfully", "id": str(existing.id)}
    else:
        new_mood = MoodLog(
            user_id=current_user.id,
            mood_rating=mood_in.mood_rating,
            mood_type=mood_in.mood_type,
            journal_entry=mood_in.journal_entry,
            sleep_hours=mood_in.sleep_hours,
            water_intake=mood_in.water_intake,
            stress_level=mood_in.stress_level,
            date=mood_in.date
        )
        db.add(new_mood)
        await db.commit()
        await db.refresh(new_mood)
        return {"status": "success", "message": "Mood log created successfully", "id": str(new_mood.id)}

@router.get("/mood", response_model=List[MoodLogOut])
async def get_moods(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MoodLog).where(MoodLog.user_id == current_user.id).order_by(MoodLog.date.desc())
    result = await db.execute(stmt)
    logs = result.scalars().all()
    return logs

@router.get("/mood/stats", response_model=Dict[str, Any])
async def get_mood_stats(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MoodLog).where(MoodLog.user_id == current_user.id).order_by(MoodLog.date.asc())
    result = await db.execute(stmt)
    logs = result.scalars().all()
        
    if not logs:
        return {
            "mood_history": [],
            "average_mood": 0,
            "average_sleep": 0,
            "average_stress": 0,
            "mood_distribution": {},
            "sleep_vs_mood": []
        }
        
    total_mood = 0
    total_sleep = 0
    total_stress = 0
    mood_dist = {}
    sleep_vs_mood = []
    
    for l in logs:
        total_mood += l.mood_rating
        total_sleep += l.sleep_hours
        total_stress += l.stress_level
        
        m_type = l.mood_type
        mood_dist[m_type] = mood_dist.get(m_type, 0) + 1
        
        sleep_vs_mood.append({
            "date": l.date,
            "sleep_hours": l.sleep_hours,
            "mood_rating": l.mood_rating,
            "stress_level": l.stress_level
        })
        
    n = len(logs)
    return {
        "mood_history": [{"date": l.date, "mood_rating": l.mood_rating, "mood_type": l.mood_type} for l in logs],
        "average_mood": round(total_mood / n, 1),
        "average_sleep": round(total_sleep / n, 1),
        "average_stress": round(total_stress / n, 1),
        "mood_distribution": mood_dist,
        "sleep_vs_mood": sleep_vs_mood
    }

# --- CBT thought diary Endpoints ---

@router.post("/cbt", response_model=Dict[str, Any])
async def create_cbt_log(cbt_in: CBTLogCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_cbt = CBTLog(
        user_id=current_user.id,
        situation=cbt_in.situation,
        negative_thoughts=cbt_in.negative_thoughts,
        distortions=cbt_in.distortions,
        rational_thoughts=cbt_in.rational_thoughts,
        date=cbt_in.date
    )
    db.add(new_cbt)
    await db.commit()
    await db.refresh(new_cbt)
    return {"status": "success", "message": "CBT log saved successfully", "id": str(new_cbt.id)}

@router.get("/cbt", response_model=List[CBTLogOut])
async def get_cbt_logs(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(CBTLog).where(CBTLog.user_id == current_user.id).order_by(CBTLog.created_at.desc())
    result = await db.execute(stmt)
    logs = result.scalars().all()
    return logs

@router.delete("/cbt/{cbt_id}", response_model=Dict[str, Any])
async def delete_cbt_log(cbt_id: str, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        cbt_uuid = uuid.UUID(cbt_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid CBT Log ID")

    stmt = select(CBTLog).where(CBTLog.id == cbt_uuid, CBTLog.user_id == current_user.id)
    cbt_log = (await db.execute(stmt)).scalar_one_or_none()
    
    if not cbt_log:
        raise HTTPException(status_code=404, detail="CBT log not found")
        
    await db.delete(cbt_log)
    await db.commit()
    return {"status": "success", "message": "CBT entry deleted"}

# --- Self-Care Habit Tracker Endpoints ---

@router.post("/habits", response_model=Dict[str, Any])
async def log_habits(habit_in: HabitLogCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(HabitLog).where(HabitLog.user_id == current_user.id, HabitLog.date == habit_in.date)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    
    habits_list = [{"name": h.name, "completed": h.completed} for h in habit_in.habits]
    
    if existing:
        existing.habits = habits_list
        await db.commit()
        return {"status": "success", "message": "Habit status updated", "id": str(existing.id)}
    else:
        new_habit = HabitLog(
            user_id=current_user.id,
            date=habit_in.date,
            habits=habits_list
        )
        db.add(new_habit)
        await db.commit()
        await db.refresh(new_habit)
        return {"status": "success", "message": "Habit status saved", "id": str(new_habit.id)}

@router.get("/habits", response_model=List[HabitLogOut])
async def get_habits(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(HabitLog).where(HabitLog.user_id == current_user.id).order_by(HabitLog.date.desc())
    result = await db.execute(stmt)
    logs = result.scalars().all()
    return logs

@router.get("/habits/stats", response_model=Dict[str, Any])
async def get_habit_stats(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(HabitLog).where(HabitLog.user_id == current_user.id).order_by(HabitLog.date.asc())
    result = await db.execute(stmt)
    logs = result.scalars().all()
        
    if not logs:
        return {
            "total_logged_days": 0,
            "habit_completion_rates": {},
            "overall_completion_rate": 0
        }
        
    # Calculate completions
    habit_counts = {}
    habit_completions = {}
    total_habits_offered = 0
    total_habits_completed = 0
    
    for log in logs:
        for habit in log.habits:
            name = habit["name"]
            habit_counts[name] = habit_counts.get(name, 0) + 1
            if habit["completed"]:
                habit_completions[name] = habit_completions.get(name, 0) + 1
                total_habits_completed += 1
            total_habits_offered += 1
            
    completion_rates = {}
    for name in habit_counts:
        completed = habit_completions.get(name, 0)
        total = habit_counts[name]
        completion_rates[name] = round((completed / total) * 100, 1)
        
    overall_rate = round((total_habits_completed / total_habits_offered) * 100, 1) if total_habits_offered > 0 else 0
    
    return {
        "total_logged_days": len(logs),
        "habit_completion_rates": completion_rates,
        "overall_completion_rate": overall_rate
    }

# --- Vitals Endpoints ---

@router.post("/vitals", response_model=Dict[str, Any])
async def log_vitals(vital_in: VitalSignCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_vital = VitalSign(
        user_id=current_user.id,
        blood_pressure=vital_in.blood_pressure,
        heart_rate=vital_in.heart_rate,
        spo2=vital_in.spo2,
        temperature=vital_in.temperature,
        bmi=vital_in.bmi,
        blood_sugar=vital_in.blood_sugar
    )
    db.add(new_vital)
    await db.commit()
    await db.refresh(new_vital)
    return {"status": "success", "message": "Vitals logged successfully"}

@router.get("/vitals", response_model=List[VitalSignOut])
async def get_vitals(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(VitalSign).where(VitalSign.user_id == current_user.id).order_by(VitalSign.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

# --- Medical Records Endpoints ---

@router.post("/records", response_model=Dict[str, Any])
async def upload_record(record_in: MedicalRecordCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_record = MedicalRecord(
        user_id=current_user.id,
        title=record_in.title,
        record_type=record_in.record_type,
        file_url=record_in.file_url
    )
    db.add(new_record)
    await db.commit()
    await db.refresh(new_record)
    return {"status": "success", "message": "Record uploaded successfully"}

@router.get("/records", response_model=List[MedicalRecordOut])
async def get_records(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MedicalRecord).where(MedicalRecord.user_id == current_user.id).order_by(MedicalRecord.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()
