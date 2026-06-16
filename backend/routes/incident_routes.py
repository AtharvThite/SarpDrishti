from flask import Blueprint, request, current_app
from utils.response import success_response, error_response
from utils.validators import validate_coordinates
from datetime import datetime, timedelta

incident_bp = Blueprint("incidents", __name__)

@incident_bp.route("/api/incidents/report", methods=["POST"])
def report_incident():
    data = request.get_json()
    if not data:
        return error_response("Invalid data", 400)
        
    lat = data.get("lat")
    lng = data.get("lng")
    
    doc = {
        "snake_identified": data.get("snake_slug"),
        "confidence_score": data.get("confidence"),
        "was_bite": data.get("was_bite", False),
        "outcome": data.get("outcome", "unknown"),
        "district": data.get("district"),
        "state": data.get("state"),
        "timestamp": datetime.utcnow(),
        "session_id": data.get("session_id"),
        "image_url": data.get("image_url")
    }
    
    if lat is not None and lng is not None and validate_coordinates(lat, lng):
        doc["location"] = {
            "type": "Point",
            "coordinates": [float(lng), float(lat)]
        }
        
    result = current_app.db.incidents.insert_one(doc)
    return success_response({"incident_id": str(result.inserted_id)})

@incident_bp.route("/api/incidents/heatmap", methods=["GET"])
def get_heatmap():
    days = int(request.args.get("days", 365))
    state = request.args.get("state")
    snake_slug = request.args.get("snake_slug")
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    query = {
        "timestamp": {"$gte": cutoff_date},
        "location": {"$exists": True}
    }
    
    if state:
        query["state"] = state
    if snake_slug:
        query["snake_identified"] = snake_slug
        
    cursor = current_app.db.incidents.find(query, {"location": 1, "snake_identified": 1})
    
    points = []
    for doc in cursor:
        coords = doc.get("location", {}).get("coordinates")
        if coords and len(coords) == 2:
            points.append({
                "lng": coords[0],
                "lat": coords[1],
                "snake": doc.get("snake_identified")
            })
            
    return success_response({
        "points": points,
        "total": len(points)
    })

@incident_bp.route("/api/incidents/stats", methods=["GET"])
def get_stats():
    total_identifications = current_app.db.incidents.count_documents({})
    total_bites = current_app.db.incidents.count_documents({"was_bite": True})
    
    cutoff_30 = datetime.utcnow() - timedelta(days=30)
    last_30 = current_app.db.incidents.count_documents({"timestamp": {"$gte": cutoff_30}})
    
    pipeline_species = [
        {"$group": {"_id": "$snake_identified", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    species_stats = list(current_app.db.incidents.aggregate(pipeline_species))
    
    most_identified = species_stats[0]["_id"] if species_stats and species_stats[0]["_id"] else None
    
    id_by_species = {s["_id"]: s["count"] for s in species_stats if s["_id"]}
    
    pipeline_state = [
        {"$group": {"_id": "$state", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    state_stats = list(current_app.db.incidents.aggregate(pipeline_state))
    id_by_state = {s["_id"]: s["count"] for s in state_stats if s["_id"]}
    
    return success_response({
        "total_identifications": total_identifications,
        "total_bites_reported": total_bites,
        "most_identified_snake": most_identified,
        "identifications_by_state": id_by_state,
        "identifications_by_species": id_by_species,
        "last_30_days": last_30
    })
