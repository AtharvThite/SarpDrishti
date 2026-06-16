from flask import Blueprint, request, current_app
from utils.response import success_response, error_response
from utils.validators import allowed_image_file, validate_coordinates
from services.image_service import save_image_temp, upload_to_cloudinary
from ml.predictor import predictor
import os
from datetime import datetime

ml_bp = Blueprint("ml", __name__)

@ml_bp.route("/api/identify", methods=["POST"])
def identify_snake():
    if "image" not in request.files:
        return error_response("No image provided", 400)
        
    file = request.files["image"]
    if file.filename == '':
        return error_response("No image selected", 400)
        
    if not allowed_image_file(file.filename):
        return error_response("Invalid file type. Allowed: jpg, jpeg, png, webp", 400)
        
    lat = request.form.get("lat")
    lng = request.form.get("lng")
    session_id = request.form.get("session_id")
    
    temp_path = save_image_temp(file)
    
    try:
        threshold = current_app.config.get("CONFIDENCE_THRESHOLD", 0.65)
        pred_result = predictor.predict(temp_path, confidence_threshold=threshold)
        
        snake_slug = pred_result["slug"]
        snake_doc = current_app.db.snakes.find_one({"slug": snake_slug})
        
        if not snake_doc:
            return error_response("Identified species not in database", 404)
            
        snake_doc["_id"] = str(snake_doc["_id"])
        
        similar_species_data = []
        similar_slugs = snake_doc.get("similar_species", [])
        if similar_slugs:
            sim_cursor = current_app.db.snakes.find({"slug": {"$in": similar_slugs}})
            for sim in sim_cursor:
                similar_species_data.append({
                    "slug": sim.get("slug"),
                    "common_name": sim.get("common_name"),
                    "is_venomous": sim.get("is_venomous"),
                    "thumbnail": sim.get("thumbnail")
                })
                
        response_snake = {
            "slug": snake_doc.get("slug"),
            "common_name": snake_doc.get("common_name"),
            "scientific_name": snake_doc.get("scientific_name"),
            "is_venomous": snake_doc.get("is_venomous"),
            "venom_type": snake_doc.get("venom_type"),
            "venom_severity": snake_doc.get("venom_severity"),
            "confidence": pred_result["confidence"],
            "is_uncertain": pred_result["is_uncertain"],
            "thumbnail": snake_doc.get("thumbnail"),
            "first_aid": snake_doc.get("first_aid", []),
            "hospital_urgency": snake_doc.get("hospital_urgency"),
            "bite_symptoms": snake_doc.get("bite_symptoms", []),
            "habitat": snake_doc.get("habitat", []),
            "distribution": snake_doc.get("distribution", []),
            "size_range_cm": snake_doc.get("size_range_cm", {"min": 0, "max": 0}),
            "antivenom": snake_doc.get("antivenom"),
            "behavior": snake_doc.get("behavior"),
            "active_period": snake_doc.get("active_period")
        }
        
        incident_id = None
        if lat is not None and lng is not None and validate_coordinates(lat, lng):
            doc = {
                "snake_identified": snake_slug,
                "confidence_score": pred_result["confidence"],
                "was_bite": False,
                "outcome": "unknown",
                "timestamp": datetime.utcnow(),
                "session_id": session_id,
                "location": {
                    "type": "Point",
                    "coordinates": [float(lng), float(lat)]
                }
            }
            res = current_app.db.incidents.insert_one(doc)
            incident_id = str(res.inserted_id)
            
        return success_response({
            "snake": response_snake,
            "similar_species": similar_species_data,
            "top_predictions": pred_result["top_predictions"],
            "incident_id": incident_id
        })
        
    except Exception as e:
        current_app.logger.error(f"Prediction error: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return error_response("Identification failed. Please try again", 500)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
