from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    mood_logs = relationship("MoodLog", back_populates="user", cascade="all, delete-orphan")
    cbt_logs = relationship("CBTLog", back_populates="user", cascade="all, delete-orphan")
    habit_logs = relationship("HabitLog", back_populates="user", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="user", cascade="all, delete-orphan")

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    mood_rating = Column(Integer, nullable=False)
    mood_type = Column(String, nullable=False)
    journal_entry = Column(Text, default="")
    sleep_hours = Column(Float, nullable=False)
    water_intake = Column(Integer, nullable=False)
    stress_level = Column(Integer, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mood_logs")

class CBTLog(Base):
    __tablename__ = "cbt_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    situation = Column(Text, nullable=False)
    negative_thoughts = Column(Text, nullable=False)
    distortions = Column(JSON, nullable=False) # List[str]
    rational_thoughts = Column(Text, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cbt_logs")

class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    habits = Column(JSON, nullable=False) # List[Dict]
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="habit_logs")

class Psychiatrist(Base):
    __tablename__ = "psychiatrists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    bio = Column(Text, nullable=False)
    rating = Column(Float, nullable=False)
    experience_years = Column(Integer, nullable=False)
    imageUrl = Column(String, nullable=False)
    session_price = Column(Integer, nullable=False)
    availability_slots = Column(JSON, nullable=False) # List[str]

    appointments = relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    psychiatrist_id = Column(UUID(as_uuid=True), ForeignKey("psychiatrists.id"), nullable=False)
    doctor_name = Column(String, nullable=False)
    doctor_specialty = Column(String, nullable=False)
    doctor_imageUrl = Column(String, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    time_slot = Column(String, nullable=False)
    session_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="upcoming") # upcoming, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="appointments")
    doctor = relationship("Psychiatrist", back_populates="appointments")
    messages = relationship("Message", back_populates="appointment", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    sender = Column(String, nullable=False) # "user" or "doctor"
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="messages")
