import os
import tempfile
import uuid
from werkzeug.utils import secure_filename
import cloudinary.uploader
from flask import current_app

def save_image_temp(file_storage_object) -> str:
    temp_dir = tempfile.gettempdir()
    _, ext = os.path.splitext(secure_filename(file_storage_object.filename))
    if not ext:
        ext = '.jpg'
    filename = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(temp_dir, filename)
    file_storage_object.save(temp_path)
    return temp_path

def upload_to_cloudinary(temp_path: str, folder: str) -> str | None:
    if not current_app.config.get("CLOUDINARY_CLOUD_NAME"):
        # Silently return None if not configured
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return None
        
    try:
        response = cloudinary.uploader.upload(
            temp_path,
            folder=folder
        )
        return response.get("secure_url")
    except Exception as e:
        current_app.logger.error(f"Cloudinary upload failed: {str(e)}")
        return None
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
