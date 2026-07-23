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
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    abha_number = Column(String, nullable=True, index=True)
    wallet_balance = Column(Float, nullable=False, default=0.0)
    role = Column(String, default="patient") # patient, doctor, admin, lab, pharmacy, super_admin
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    mood_logs = relationship("MoodLog", back_populates="user", cascade="all, delete-orphan")
    cbt_logs = relationship("CBTLog", back_populates="user", cascade="all, delete-orphan")
    habit_logs = relationship("HabitLog", back_populates="user", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="user", foreign_keys="[Appointment.user_id]", cascade="all, delete-orphan")
    doctor_appointments = relationship("Appointment", back_populates="doctor", foreign_keys="[Appointment.doctor_id]", cascade="all, delete-orphan")
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    vital_signs = relationship("VitalSign", back_populates="user", cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="user", cascade="all, delete-orphan")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False) # "hospital", "clinic", "lab", "pharmacy"
    address = Column(Text, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")

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

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    specialty = Column(String, nullable=False, default="General Practitioner")
    bio = Column(Text, nullable=False, default="Dedicated healthcare professional.")
    rating = Column(Float, nullable=False, default=5.0)
    experience_years = Column(Integer, nullable=False, default=1)
    image_url = Column(String, nullable=False, default="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300")
    session_price = Column(Integer, nullable=False, default=100)
    availability_slots = Column(JSON, nullable=False, default=list) # List[str]
    status = Column(String, default="pending") # pending, approved, rejected
    license_number = Column(String, nullable=True)

    user = relationship("User", back_populates="doctor_profile")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    doctor_name = Column(String, nullable=False)
    doctor_specialty = Column(String, nullable=False)
    doctor_imageUrl = Column(String, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    time_slot = Column(String, nullable=False)
    session_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="upcoming") # upcoming, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="appointments", foreign_keys=[user_id])
    doctor = relationship("User", back_populates="doctor_appointments", foreign_keys=[doctor_id])
    messages = relationship("Message", back_populates="appointment", cascade="all, delete-orphan")
    clinical_note = relationship("ClinicalNote", back_populates="appointment", uselist=False, cascade="all, delete-orphan")
    prescription = relationship("Prescription", back_populates="appointment", uselist=False, cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    sender = Column(String, nullable=False) # "user" or "doctor"
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="messages")

class VitalSign(Base):
    __tablename__ = "vital_signs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    blood_pressure = Column(String, nullable=True) # e.g. "120/80"
    heart_rate = Column(Integer, nullable=True)
    spo2 = Column(Integer, nullable=True)
    temperature = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    blood_sugar = Column(Float, nullable=True)

    user = relationship("User", back_populates="vital_signs")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    record_type = Column(String, nullable=False) # "lab_report", "scan", "prescription"
    file_url = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="medical_records")

class ClinicalNote(Base):
    __tablename__ = "clinical_notes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False, unique=True)
    subjective = Column(Text, nullable=True)
    objective = Column(Text, nullable=True)
    assessment = Column(Text, nullable=True)
    plan = Column(Text, nullable=True)
    icd10_codes = Column(JSON, nullable=True) # List[str]
    created_at = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="clinical_note")

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False, unique=True)
    medications = Column(JSON, nullable=False) # List[Dict] with name, dosage, frequency, duration
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="prescription")

class PharmacyOrder(Base):
    __tablename__ = "pharmacy_orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    pharmacy_org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    prescription_id = Column(UUID(as_uuid=True), ForeignKey("prescriptions.id"), nullable=True)
    status = Column(String, default="pending") # pending, processing, shipped, delivered, cancelled
    items = Column(JSON, nullable=False)
    total_amount = Column(Float, nullable=False, default=0.0)
    delivery_status = Column(String, default="not_started") # not_started, out_for_delivery, delivered
    delivery_agent_info = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LabTestRequest(Base):
    __tablename__ = "lab_test_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    lab_org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    test_names = Column(JSON, nullable=False) # List[str]
    status = Column(String, default="pending") # pending, sample_collected, processing, completed
    report_url = Column(String, nullable=True)
    tat_hours_expected = Column(Integer, nullable=True)
    tat_hours_actual = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable=False) # deposit, payment, refund
    status = Column(String, default="pending") # pending, success, failed
    reference_id = Column(String, nullable=True) # Gateway reference
    created_at = Column(DateTime, default=datetime.utcnow)

class InsuranceDetail(Base):
    __tablename__ = "insurance_details"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    provider_name = Column(String, nullable=False)
    policy_number = Column(String, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    valid_until = Column(DateTime, nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    action = Column(String, nullable=False)
    actor_id = Column(String, nullable=False)
    target_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    pharmacy_org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    price = Column(Float, nullable=False)
    substitute_suggestions = Column(JSON, nullable=True) # List of alternative item IDs/names

class WearableData(Base):
    __tablename__ = "wearable_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    device_type = Column(String, nullable=False) # AppleHealth, Fitbit
    data_type = Column(String, nullable=False) # steps, heart_rate, sleep
    value = Column(String, nullable=False)
    recorded_at = Column(DateTime, nullable=False)
    synced_at = Column(DateTime, default=datetime.utcnow)

class SystemSettings(Base):
    __tablename__ = "system_settings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    setting_key = Column(String, nullable=False, unique=True)
    setting_value = Column(Boolean, nullable=False, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PatientProfileExt(Base):
    __tablename__ = "patient_profiles_ext"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MedicalHistory(Base):
    __tablename__ = "medical_histories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    chronic_conditions = Column(JSON, nullable=True, default=list) # List[str]
    past_surgeries = Column(JSON, nullable=True, default=list) # List[Dict]
    allergies = Column(JSON, nullable=True, default=list) # List[Dict]
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationPreferences(Base):
    __tablename__ = "notification_preferences"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    push_enabled = Column(Boolean, default=True)
    email_enabled = Column(Boolean, default=True)
    sms_enabled = Column(Boolean, default=False)
    appointment_alerts = Column(Boolean, default=True)
    medication_alerts = Column(Boolean, default=True)
    lab_alerts = Column(Boolean, default=True)
    marketing_alerts = Column(Boolean, default=False)
    dnd_enabled = Column(Boolean, default=False)
    dnd_start_time = Column(String, default="22:00")
    dnd_end_time = Column(String, default="07:00")
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False) # appointment, health_alert, system
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", foreign_keys=[user_id])

class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    slots = Column(JSON, nullable=False, default=list) # List of time slots e.g. ["09:00 AM", "09:30 AM"]
    auto_buffer_mins = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
