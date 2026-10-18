"""Configure Cloudinary and upload user files."""

import logging

import cloudinary
import cloudinary.uploader

logger = logging.getLogger(__name__)


def init_cloudinary():
    cloudinary.config(secure=True)


def upload_image(file_obj, folder="ansaea"):
    """Return the secure URL for a path, URL, or open file; return None on failure."""
    try:
        response = cloudinary.uploader.upload(file_obj, folder=folder)
        return response.get("secure_url")
    except Exception:
        logger.exception("Cloudinary upload failed")
        return None
