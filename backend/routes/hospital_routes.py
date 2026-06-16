from flask import Blueprint, request, current_app
from utils.response import success_response, error_response, paginated_response
from utils.validators import validate_coordinates

hospital_bp = Blueprint("hospitals", __name__)

@hospital_bp.route("/api/hospitals/nearby", methods=["GET"])
def get_nearby_hospitals():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    radius_km = int(request.args.get("radius_km", 50))
    radius_km = min(radius_km, 200)
    antivenom_only = request.args.get("antivenom_only", "true").lower() == "true"
    
    if lat is None or lng is None or not validate_coordinates(lat, lng):
        return error_response("Invalid coordinates", 400)
        
    lat = float(lat)
    lng = float(lng)
    
    match_stage = {}
    if antivenom_only:
        match_stage["has_antivenom"] = True
        
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
    
    hospitals = list(current_app.db.hospitals.aggregate(pipeline))
    
    result = []
    for h in hospitals:
        result.append({
            "_id": str(h["_id"]),
            "name": h.get("name"),
            "address": h.get("address"),
            "district": h.get("district"),
            "state": h.get("state"),
            "emergency_number": h.get("emergency_number"),
            "has_antivenom": h.get("has_antivenom"),
            "antivenom_info": h.get("antivenom_info", {}),
            "type": h.get("type"),
            "google_maps_url": h.get("google_maps_url"),
            "distance_km": round(h.get("distance_km", 0), 1)
        })
        
    return success_response({
        "hospitals": result,
        "count": len(result)
    })

@hospital_bp.route("/api/hospitals", methods=["GET"])
def get_hospitals():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    limit = min(limit, 100)
    
    query = {}
    
    state = request.args.get("state")
    if state:
        query["state"] = state
        
    district = request.args.get("district")
    if district:
        query["district"] = district
        
    skip = (page - 1) * limit
    
    cursor = current_app.db.hospitals.find(query).skip(skip).limit(limit)
    hospitals = []
    for h in cursor:
        h["_id"] = str(h["_id"])
        hospitals.append(h)
        
    total = current_app.db.hospitals.count_documents(query)
    
    return paginated_response(hospitals, page, limit, total, key_name="hospitals")
