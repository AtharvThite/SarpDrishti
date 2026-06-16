from flask import Blueprint, request, current_app
from utils.response import success_response, error_response, paginated_response
from middleware.auth import require_admin
import re

snake_bp = Blueprint("snakes", __name__)

@snake_bp.route("/api/snakes", methods=["GET"])
def get_snakes():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    limit = min(limit, 100)
    
    query = {}
    
    venomous = request.args.get("venomous")
    if venomous:
        query["is_venomous"] = venomous.lower() == "true"
        
    state = request.args.get("state")
    if state:
        query["distribution"] = state
        
    family = request.args.get("family")
    if family:
        query["family"] = family
        
    search = request.args.get("search")
    if search:
        query["$text"] = {"$search": search}
        
    skip = (page - 1) * limit
    
    cursor = current_app.db.snakes.find(query).skip(skip).limit(limit)
    snakes = []
    for doc in cursor:
        snakes.append({
            "slug": doc.get("slug"),
            "common_name": doc.get("common_name"),
            "scientific_name": doc.get("scientific_name"),
            "is_venomous": doc.get("is_venomous"),
            "venom_severity": doc.get("venom_severity"),
            "thumbnail": doc.get("thumbnail"),
            "habitat": doc.get("habitat", []),
            "distribution": doc.get("distribution", [])
        })
        
    total = current_app.db.snakes.count_documents(query)
    
    return paginated_response(snakes, page, limit, total, key_name="snakes")

@snake_bp.route("/api/snakes/<slug>", methods=["GET"])
def get_snake(slug):
    snake = current_app.db.snakes.find_one({"slug": slug})
    if not snake:
        return error_response("Snake not found", 404)
        
    snake["_id"] = str(snake["_id"])
    
    similar_slugs = snake.get("similar_species", [])
    similar_species_data = []
    if similar_slugs:
        sim_cursor = current_app.db.snakes.find({"slug": {"$in": similar_slugs}})
        for sim in sim_cursor:
            similar_species_data.append({
                "slug": sim.get("slug"),
                "common_name": sim.get("common_name"),
                "is_venomous": sim.get("is_venomous"),
                "thumbnail": sim.get("thumbnail")
            })
            
    snake["similar_species_data"] = similar_species_data
    
    return success_response(snake)

@snake_bp.route("/api/snakes", methods=["POST"])
@require_admin
def create_snake():
    data = request.get_json()
    if not data or "slug" not in data:
        return error_response("Invalid data", 400)
        
    try:
        result = current_app.db.snakes.insert_one(data)
        return success_response({"slug": data["slug"], "id": str(result.inserted_id)})
    except Exception as e:
        return error_response(str(e), 500)

@snake_bp.route("/api/snakes/<slug>", methods=["PUT"])
@require_admin
def update_snake(slug):
    data = request.get_json()
    if not data:
        return error_response("Invalid data", 400)
        
    result = current_app.db.snakes.update_one({"slug": slug}, {"$set": data})
    if result.matched_count == 0:
        return error_response("Snake not found", 404)
        
    return success_response({"updated": True})

@snake_bp.route("/api/snakes/<slug>", methods=["DELETE"])
@require_admin
def delete_snake(slug):
    result = current_app.db.snakes.delete_one({"slug": slug})
    if result.deleted_count == 0:
        return error_response("Snake not found", 404)
        
    return success_response({"deleted": True})
