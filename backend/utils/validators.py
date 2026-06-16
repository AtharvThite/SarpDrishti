import re

def validate_phone(phone: str) -> bool:
    if not phone: return False
    return bool(re.match(r"^\+91[0-9]{10}$", phone))

def validate_email(email: str) -> bool:
    if not email: return False
    return bool(re.match(r"^[^@]+@[^@]+\.[^@]+$", email))

def validate_coordinates(lat: float, lng: float) -> bool:
    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        return False
        
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return False
        
    # Check if within India bounding box: lat: 6.5 to 37.5, lng: 68.0 to 97.5
    if not (6.5 <= lat <= 37.5 and 68.0 <= lng <= 97.5):
        return False
        
    return True

def allowed_image_file(filename: str) -> bool:
    allowed = {'jpg', 'jpeg', 'png', 'webp'}
    return validate_file_extension(filename, allowed)

def validate_file_extension(filename: str, allowed: set) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed
