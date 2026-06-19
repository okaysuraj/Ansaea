from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

# Imports
from app.database import get_db, engine
from app.db_models import Base, User, Psychiatrist
from app.auth import get_password_hash, create_access_token, verify_password
from app.models import UserRegister, UserLogin, Token
from app.routers import tracker, psychiatrist, chat

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

# --- Authentication Routes directly inside main (or router) ---
auth_router = APIRouter(prefix="/api/auth", tags=["Auth"])

@auth_router.post("/register", response_model=Token)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if email already registered
    stmt_email = select(User).where(User.email == user_in.email)
    existing_email = (await db.execute(stmt_email)).scalar_one_or_none()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
        
    # Check if username already registered
    stmt_username = select(User).where(User.username == user_in.username)
    existing_username = (await db.execute(stmt_username)).scalar_one_or_none()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists"
        )
        
    # Create user document
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    await db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": user_in.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user_in.username,
        "email": user_in.email,
        "role": user_in.role
    }

@auth_router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    # Find user by email
    stmt = select(User).where(User.email == user_in.email)
    user = (await db.execute(stmt)).scalar_one_or_none()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

app.include_router(auth_router)

# --- Startup Event (Seeding Psychiatrists) ---
@app.on_event("startup")
async def startup_event():
    # Verify DB connection works and create tables
    print("Connecting to PostgreSQL database and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed psychiatrists
    from app.database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        count_stmt = select(func.count()).select_from(Psychiatrist)
        count = (await db.execute(count_stmt)).scalar()
        
        print(f"Current psychiatrists count: {count}. Re-seeding doctors to maintain standard slots.")
        
        # We clear and re-seed to ensure clean data is always present with good links
        delete_stmt = Psychiatrist.__table__.delete()
        await db.execute(delete_stmt)
        
        mock_doctors = [
            Psychiatrist(
                name="Dr. Evelyn Carter",
                specialty="CBT & Anxiety Specialist",
                bio="Empathy-driven professional focusing on grounding techniques, stress relief, and thought reframing. Over 12 years of experience guiding minds to tranquility.",
                rating=4.9,
                experience_years=12,
                imageUrl="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                session_price=120,
                availability_slots=["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
            ),
            Psychiatrist(
                name="Dr. Marcus Vance",
                specialty="Mindfulness & Mood Coach",
                bio="Blends traditional clinical psychiatric insights with mindfulness-based stress reduction. Passionate about helping individuals overcome depression, grief, and emotional burnout.",
                rating=4.8,
                experience_years=15,
                imageUrl="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
                session_price=150,
                availability_slots=["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"]
            ),
            Psychiatrist(
                name="Dr. Sarah Jenkins",
                specialty="ADHD & Habit Coach",
                bio="Specializes in neurodivergence, structural counseling, and behavior modifications. Empowers users with active coping mechanisms, focus strategies, and self-organization habits.",
                rating=4.7,
                experience_years=9,
                imageUrl="https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=300",
                session_price=110,
                availability_slots=["08:00 AM", "01:00 PM", "04:00 PM", "06:00 PM"]
            ),
            Psychiatrist(
                name="Dr. Adrian Sterling",
                specialty="Relationship & Trauma Recovery",
                bio="Dedicated therapist specializing in family dynamics, emotional boundary setup, trauma integration, and healing deep-seated relational anxieties.",
                rating=4.9,
                experience_years=18,
                imageUrl="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
                session_price=160,
                availability_slots=["11:00 AM", "02:00 PM", "05:00 PM", "07:00 PM"]
            )
        ]
        
        db.add_all(mock_doctors)
        await db.commit()
        print("Database seeded with mock psychiatrists successfully.")

@app.get("/")
async def root():
    return {"message": "Ansaea Backend API is running successfully on PostgreSQL."}
