from functools import wraps
from flask import request, g, current_app
import jwt
from utils.response import error_response

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return error_response("Unauthorized", 401)
            
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(
                token, 
                current_app.config["JWT_SECRET"], 
                algorithms=["HS256"]
            )
            g.admin_id = payload.get("admin_id")
        except jwt.ExpiredSignatureError:
            return error_response("Token expired", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid token", 401)
            
        return f(*args, **kwargs)
    return decorated
