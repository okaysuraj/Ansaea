"""Authenticated file uploads to Cloudinary."""

from typing import Any, Dict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from app.auth import get_current_user
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/api/upload", tags=["Upload"])


@router.post("/", response_model=Dict[str, Any])
async def upload_file_endpoint(
    file: UploadFile = File(...), current_user=Depends(get_current_user)
):
    url = await run_in_threadpool(
        upload_image, file.file, folder=f"ansaea/user_{current_user.id}"
    )
    if not url:
        raise HTTPException(status_code=500, detail="Failed to upload file")

    return {"status": "success", "url": url}
