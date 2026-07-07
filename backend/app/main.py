from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

# Imports
from app.database import get_db, engine
from app.db_models import Base, User
from app.auth import get_current_user
from app.routers import tracker, psychiatrist, chat, users, ai_routes, patients, doctors, pharmacy, lab

app = FastAPI(title="Ansaea Mental Health Portal API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(tracker.router)
app.include_router(psychiatrist.router)
app.include_router(chat.router)
app.include_router(users.router)
app.include_router(ai_routes.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(pharmacy.router)
app.include_router(lab.router)



# --- Startup Event (Seeding Psychiatrists) ---
@app.on_event("startup")
async def startup_event():
    # Verify DB connection works and create tables
    print("Connecting to PostgreSQL database and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Mock seeding removed as users now register as clinicians dynamically.

@app.get("/")
async def root():
    return {"message": "Ansaea Backend API is running successfully on PostgreSQL."}
