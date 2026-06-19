from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import cloudinary
import os
import traceback

from config import Config

# Import Blueprints
from routes.snake_routes import snake_bp
from routes.rescuer_routes import rescuer_bp
from routes.hospital_routes import hospital_bp
from routes.incident_routes import incident_bp
from routes.auth_routes import auth_bp
from routes.ml_routes import ml_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS (CRITICAL RULE #9)
    frontend_url = os.environ.get("FRONTEND_URL", "https://sarpdrishti.vercel.app")
    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        frontend_url
    ]
    CORS(app, 
         resources={r"/api/*": {"origins": origins}},
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Session-ID"],
         expose_headers=["Content-Range"],
         supports_credentials=True)
         
    # Configure Cloudinary
    if app.config.get("CLOUDINARY_CLOUD_NAME"):
        cloudinary.config(
            cloud_name=app.config["CLOUDINARY_CLOUD_NAME"],
            api_key=app.config["CLOUDINARY_API_KEY"],
            api_secret=app.config["CLOUDINARY_API_SECRET"]
        )

    # Initialize MongoDB Client
    client = MongoClient(app.config["MONGO_URI"])
    app.db = client[app.config["DB_NAME"]]
    
    # Configure Indexes (CRITICAL RULE #11)
    with app.app_context():
        try:
            app.db.snakes.create_index("slug", unique=True)
            app.db.snakes.create_index("is_venomous")
            app.db.snakes.create_index("distribution")
            app.db.snakes.create_index([("common_name", "text"), ("scientific_name", "text")])
            
            app.db.rescuers.create_index([("location", "2dsphere")])
            app.db.rescuers.create_index("is_verified")
            app.db.rescuers.create_index("is_available")
            app.db.rescuers.create_index("phone", unique=True)
            
            app.db.hospitals.create_index([("location", "2dsphere")])
            app.db.hospitals.create_index("has_antivenom")
            
            app.db.incidents.create_index([("location", "2dsphere")])
            app.db.incidents.create_index("timestamp")
            app.db.incidents.create_index("snake_identified")
            app.logger.info("MongoDB indexes verified/created.")
        except Exception as e:
            app.logger.error(f"Failed to create indexes: {e}")

    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": "Bad request"}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"success": False, "error": "Forbidden"}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": "Not found"}), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({"success": False, "error": "File too large. Max 10MB"}), 413

    @app.errorhandler(429)
    def too_many_requests(error):
        return jsonify({"success": False, "error": "Too many requests"}), 429

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error("Internal Server Error:")
        app.logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        from werkzeug.exceptions import HTTPException
        if isinstance(e, HTTPException):
            return jsonify({"success": False, "error": e.description}), e.code
        app.logger.error(f"Unhandled Exception: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": "Internal server error"}), 500

    app.register_blueprint(snake_bp)
    app.register_blueprint(rescuer_bp)
    app.register_blueprint(hospital_bp)
    app.register_blueprint(incident_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(ml_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        db_status = "disconnected"
        try:
            client.admin.command('ping')
            db_status = "connected"
        except:
            pass
            
        try:
            from routes.ml_routes import get_predictor
            predictor = get_predictor()
            ml_status = predictor.health_check()["status"]
        except Exception:
            ml_status = "unknown"
        
        return jsonify({
            "status": "ok",
            "service": "SarpDrishti API",
            "version": "1.0.0",
            "database": db_status,
            "ml_model": ml_status
        })

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
