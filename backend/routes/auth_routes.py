from flask import Blueprint, request, current_app
from utils.response import success_response, error_response
from middleware.auth import require_admin
import bcrypt
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/admin/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return error_response("Missing credentials", 400)
        
    admin = current_app.db.admins.find_one({"email": data["email"]})
    if not admin:
        return error_response("Invalid credentials", 401)
        
    if not bcrypt.checkpw(data["password"].encode("utf-8"), admin["password_hash"]):
        return error_response("Invalid credentials", 401)
        
    token = jwt.encode(
        {
            "admin_id": str(admin["_id"]),
            "role": admin.get("role", "superadmin"),
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        current_app.config["JWT_SECRET"],
        algorithm="HS256"
    )
    
    return success_response({
        "token": token,
        "role": admin.get("role", "superadmin")
    })

@auth_bp.route("/api/auth/admin/logout", methods=["POST"])
@require_admin
def logout():
    return success_response({"message": "Logged out"})
