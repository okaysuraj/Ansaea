import cloudinary
import cloudinary.uploader
import os

def init_cloudinary():
    # The cloudinary SDK automatically picks up CLOUDINARY_URL from the environment.
    # We just need to enforce secure URLs (HTTPS).
    cloudinary.config(secure=True)

def upload_image(file_obj, folder="ansaea"):
    """
    Uploads an image/file to Cloudinary.
    `file_obj` can be a file path, an HTTP URL, or a file-like object (like from FastAPI UploadFile).
    """
    try:
        response = cloudinary.uploader.upload(file_obj, folder=folder)
        return response.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None
