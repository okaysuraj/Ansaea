from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid

# --- Authentication Models ---

class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    role: str = "user"
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Tracking Models ---
class MoodLogCreate(BaseModel):
    mood_rating: int = Field(..., ge=1, le=10)
    mood_type: str  # e.g., "happy", "calm", "anxious", "sad", "stressed", "angry"
    journal_entry: str = ""
    sleep_hours: float = Field(..., ge=0.0, le=24.0)
    water_intake: int = Field(..., ge=0) # glasses
    stress_level: int = Field(..., ge=1, le=10)
    date: str  # YYYY-MM-DD

class MoodLogOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    mood_rating: int
    mood_type: str
    journal_entry: str
    sleep_hours: float
    water_intake: int
    stress_level: int
    date: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CBTLogCreate(BaseModel):
    situation: str
    negative_thoughts: str
    distortions: List[str]  # e.g., "Catastrophizing", "All-or-Nothing"
    rational_thoughts: str
    date: str  # YYYY-MM-DD

class CBTLogOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    situation: str
    negative_thoughts: str
    distortions: List[str]
    rational_thoughts: str
    date: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HabitItem(BaseModel):
    name: str
    completed: bool

class HabitLogCreate(BaseModel):
    date: str  # YYYY-MM-DD
    habits: List[HabitItem]

class HabitLogOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    date: str
    habits: List[HabitItem]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Doctor & Appointment Models ---
class DoctorOut(BaseModel):
    id: uuid.UUID
    name: str
    specialty: str
    bio: str
    rating: float
    experience_years: int
    imageUrl: str
    session_price: int
    availability_slots: List[str]

    model_config = ConfigDict(from_attributes=True)

class AppointmentCreate(BaseModel):
    doctor_id: uuid.UUID
    date: str  # YYYY-MM-DD
    time_slot: str  # e.g. "10:00 AM"
    session_type: str  # "chat", "call", "video"

class AppointmentOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    doctor_id: uuid.UUID
    doctor_name: str
    doctor_specialty: str
    doctor_imageUrl: str
    date: str
    time_slot: str
    session_type: str
    status: str  # "upcoming", "completed", "cancelled"
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Messaging Models ---
class MessageCreate(BaseModel):
    text: str

class MessageOut(BaseModel):
    id: uuid.UUID
    appointment_id: uuid.UUID
    sender: str  # "user" or "doctor"
    text: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
