from flask import Blueprint, request, current_app
from utils.response import success_response, error_response
from utils.localization import apply_translation
from utils.validators import validate_phone, validate_email, validate_coordinates
from middleware.auth import require_admin
from datetime import datetime

rescuer_bp = Blueprint("rescuers", __name__)

@rescuer_bp.route("/api/rescuers/nearby", methods=["GET"])
def get_nearby_rescuers():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    radius_km = int(request.args.get("radius_km", 25))
    radius_km = min(radius_km, 100)
    lang = request.args.get("lang", "en")
    available_only = request.args.get("available_only", "false").lower() == "true"
    
    if lat is None or lng is None or not validate_coordinates(lat, lng):
        return error_response("Invalid coordinates", 400)
        
    lat = float(lat)
    lng = float(lng)
    
    match_stage = {"is_verified": True, "is_active": True}
    if available_only:
        match_stage["is_available"] = True
        
    pipeline = [
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "distanceField": "distance_km",
                "maxDistance": radius_km * 1000,
                "distanceMultiplier": 0.001,
                "spherical": True,
                "query": match_stage
            }
        },
        {
            "$sort": {"distance_km": 1}
        }
    ]
    
    rescuers = list(current_app.db.rescuers.aggregate(pipeline))
    
    result = []
    for r in rescuers:
        r = apply_translation(r, lang)
        phone = r.get("phone", "")
        masked = ""
        if phone and len(phone) >= 13:
            masked = phone[:3] + " " + "X"*5 + phone[-4:]
            
        result.append({
            "_id": str(r["_id"]),
            "name": r.get("name"),
            "phone": r.get("phone"),
            "phone_masked": masked,
            "whatsapp": r.get("whatsapp"),
            "districts_covered": r.get("districts_covered", []),
            "rating": r.get("rating", 0.0),
            "total_rescues": r.get("total_rescues", 0),
            "is_available": r.get("is_available"),
            "profile_photo": r.get("profile_photo"),
            "experience_years": r.get("experience_years"),
            "availability_hours": r.get("availability_hours", {}),
            "bio": r.get("bio", ""),
            "distance_km": round(r.get("distance_km", 0), 1)
        })
        
    return success_response({
        "rescuers": result,
        "count": len(result),
        "search_radius_km": radius_km
    })

@rescuer_bp.route("/api/rescuers", methods=["GET"])
def get_rescuers():
    district = request.args.get("district")
    lang = request.args.get("lang", "en")
    
    query = {"is_verified": True, "is_active": True}
    if district:
        query["districts_covered"] = {"$regex": f"^{district}$", "$options": "i"}
        
    cursor = current_app.db.rescuers.find(query).sort("rating", -1)
    
    result = []
    for r in cursor:
        r = apply_translation(r, lang)
        phone = r.get("phone", "")
        masked = ""
        if phone and len(phone) >= 13:
            masked = phone[:3] + " " + "X"*5 + phone[-4:]
            
        result.append({
            "_id": str(r["_id"]),
            "name": r.get("name"),
            "phone": r.get("phone"),
            "phone_masked": masked,
            "whatsapp": r.get("whatsapp"),
            "districts_covered": r.get("districts_covered", []),
            "rating": r.get("rating", 0.0),
            "total_rescues": r.get("total_rescues", 0),
            "is_available": r.get("is_available"),
            "profile_photo": r.get("profile_photo"),
            "experience_years": r.get("experience_years"),
            "availability_hours": r.get("availability_hours", {}),
            "bio": r.get("bio", ""),
            "is_verified": r.get("is_verified")
        })
        
    return success_response({
        "rescuers": result,
        "count": len(result)
    })


@rescuer_bp.route("/api/rescuers/register", methods=["POST"])
def register_rescuer():
    data = request.get_json()
    if not data:
        return error_response("Invalid data", 400)
        
    required_fields = ["name", "phone", "email", "lat", "lng", "districts_covered", "experience_years"]
    for field in required_fields:
        if field not in data:
            return error_response(f"Missing required field: {field}", 400)
            
    if not validate_phone(data["phone"]):
        return error_response("Invalid phone format. Must be +91 followed by 10 digits", 400)
        
    if not validate_email(data["email"]):
        return error_response("Invalid email format", 400)
        
    if not validate_coordinates(data["lat"], data["lng"]):
        return error_response("Invalid coordinates", 400)
        
    try:
        exp_years = int(data["experience_years"])
        if not (0 <= exp_years <= 60):
            return error_response("Experience years must be between 0 and 60", 400)
    except ValueError:
        return error_response("Experience years must be an integer", 400)
        
    if not isinstance(data["districts_covered"], list) or len(data["districts_covered"]) == 0:
        return error_response("Districts covered must be a non-empty list", 400)

    # Check for duplicate
    if current_app.db.rescuers.find_one({"phone": data["phone"]}):
        return error_response("Phone number already registered", 409)

    doc = {
        "name": data["name"],
        "phone": data["phone"],
        "whatsapp": data.get("whatsapp", data["phone"]),
        "email": data["email"],
        "location": {
            "type": "Point",
            "coordinates": [float(data["lng"]), float(data["lat"])] # Longitude first!
        },
        "address": data.get("address", ""),
        "districts_covered": data["districts_covered"],
        "service_radius_km": int(data.get("service_radius_km", 25)),
        "is_available": False,
        "is_verified": False,
        "is_active": True,
        "experience_years": exp_years,
        "organization": data.get("organization", ""),
        "certifications": data.get("certifications", []),
        "profile_photo": data.get("profile_photo"),
        "bio": data.get("bio", ""),
        "rating": 0.0,
        "total_rescues": 0,
        "reviews": [],
        "availability_hours": {
            "is_24x7": data.get("is_24x7", False),
            "start": data.get("start_time", "08:00"),
            "end": data.get("end_time", "20:00")
        },
        "created_at": datetime.utcnow(),
        "last_seen": datetime.utcnow()
    }
    
    result = current_app.db.rescuers.insert_one(doc)
    return success_response({
        "message": "Registration successful. Pending verification.",
        "rescuer_id": str(result.inserted_id)
    })

@rescuer_bp.route("/api/rescuers/<id>/availability", methods=["PATCH"])
def update_availability(id):
    data = request.get_json()
    if not data or "is_available" not in data:
        return error_response("Missing is_available flag", 400)
        
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        return error_response("Invalid rescuer ID", 400)
        
    result = current_app.db.rescuers.update_one(
        {"_id": obj_id},
        {"$set": {
            "is_available": bool(data["is_available"]),
            "last_seen": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        return error_response("Rescuer not found", 404)
        
    return success_response({"is_available": bool(data["is_available"])})

@rescuer_bp.route("/api/rescuers/<id>/review", methods=["POST"])
def add_review(id):
    data = request.get_json()
    if not data or "rating" not in data:
        return error_response("Missing rating", 400)
        
    try:
        rating = int(data["rating"])
        if not (1 <= rating <= 5):
            return error_response("Rating must be between 1 and 5", 400)
    except ValueError:
        return error_response("Rating must be an integer", 400)
        
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        return error_response("Invalid rescuer ID", 400)
        
    rescuer = current_app.db.rescuers.find_one({"_id": obj_id})
    if not rescuer:
        return error_response("Rescuer not found", 404)
        
    new_review = {
        "rating": rating,
        "comment": data.get("comment", ""),
        "date": datetime.utcnow(),
        "user_id": data.get("user_id", "anonymous")
    }
    
    reviews = rescuer.get("reviews", [])
    reviews.append(new_review)
    
    # Recalculate rating
    total_rating = sum(r["rating"] for r in reviews)
    avg_rating = total_rating / len(reviews) if reviews else 0.0
    
    current_app.db.rescuers.update_one(
        {"_id": obj_id},
        {"$set": {"reviews": reviews, "rating": avg_rating}}
    )
    
    return success_response({"new_rating": avg_rating})

@rescuer_bp.route("/api/rescuers/<id>", methods=["GET"])
def get_rescuer(id):
    lang = request.args.get("lang", "en")
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        return error_response("Invalid rescuer ID", 400)
        
    r = current_app.db.rescuers.find_one({"_id": obj_id})
    if not r:
        return error_response("Rescuer not found", 404)
        
    r = apply_translation(r, lang)
    phone = r.get("phone", "")
    masked = ""
    if phone and len(phone) >= 13:
        masked = phone[:3] + " " + "X"*5 + phone[-4:]
        
    public_profile = {
        "_id": str(r["_id"]),
        "name": r.get("name"),
        "phone": r.get("phone"),
        "phone_masked": masked,
        "whatsapp": r.get("whatsapp"),
        "location": r.get("location"),
        "address": r.get("address"),
        "districts_covered": r.get("districts_covered", []),
        "service_radius_km": r.get("service_radius_km"),
        "is_available": r.get("is_available"),
        "is_verified": r.get("is_verified"),
        "is_active": r.get("is_active"),
        "experience_years": r.get("experience_years"),
        "organization": r.get("organization"),
        "certifications": r.get("certifications", []),
        "profile_photo": r.get("profile_photo"),
        "bio": r.get("bio", ""),
        "rating": r.get("rating", 0.0),
        "total_rescues": r.get("total_rescues", 0),
        "reviews": r.get("reviews", []),
        "availability_hours": r.get("availability_hours", {}),
        "created_at": r.get("created_at"),
        "last_seen": r.get("last_seen")
    }
    
    return success_response(public_profile)
