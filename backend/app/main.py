"""Create the API, configure CORS, and register domain routes."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models.db_models import Base
from app.routes import (
    admin,
    ai_routes,
    billing,
    chat,
    doctors,
    lab,
    notifications,
    patients,
    pharmacy,
    psychiatrist,
    support,
    tracker,
    upload,
    users,
    video,
)
from app.services.cloudinary_service import init_cloudinary


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)
        init_cloudinary()
        yield
    finally:
        await engine.dispose()


app = FastAPI(
    title="Ansaea Mental Health Portal API", version="1.0.0", lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "https://ansaea.netlify.app",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route_module in (
    tracker,
    psychiatrist,
    chat,
    users,
    ai_routes,
    patients,
    doctors,
    pharmacy,
    lab,
    billing,
    admin,
    notifications,
    upload,
    support,
    video,
):
    app.include_router(route_module.router)


@app.get("/")
async def root():
    return {"message": "Ansaea Backend API is running successfully on PostgreSQL."}
