import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY           = os.getenv("SECRET_KEY", "dev-secret")
    MONGO_URI            = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME              = os.getenv("DB_NAME", "sarpdrishti")

    # ML Model — path to the keras file downloaded from Colab
    MODEL_PATH           = os.getenv(
                               "MODEL_PATH",
                               "ml/weights/snake_model.keras"
                           )
    MODEL_INPUT_SIZE     = (224, 224)
    CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.65"))

    # File upload
    MAX_CONTENT_LENGTH   = 10 * 1024 * 1024   # 10MB
    ALLOWED_EXTENSIONS   = {"jpg", "jpeg", "png", "webp"}

    # Cloudinary (optional)
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY    = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

    JWT_SECRET            = os.getenv("JWT_SECRET", "jwt-secret")
    JWT_EXPIRY_HOURS      = 24
