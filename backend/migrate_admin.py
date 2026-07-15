import asyncio
from sqlalchemy import text
from app.database import engine
from app.db_models import Base

async def migrate():
    async with engine.begin() as conn:
        print("Creating new tables if any...")
        await conn.run_sync(Base.metadata.create_all)
        
        print("Adding status to doctor_profiles...")
        try:
            await conn.execute(text("ALTER TABLE doctor_profiles ADD COLUMN status VARCHAR DEFAULT 'pending'"))
        except Exception as e:
            print(f"Column status may already exist: {e}")

        print("Adding license_number to doctor_profiles...")
        try:
            await conn.execute(text("ALTER TABLE doctor_profiles ADD COLUMN license_number VARCHAR"))
        except Exception as e:
            print(f"Column license_number may already exist: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
