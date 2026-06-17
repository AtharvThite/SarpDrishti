import os
import uuid
import tempfile
from datetime import datetime
from flask import Blueprint, request, current_app
from utils.response import success_response, error_response
from ml.predictor import SnakePredictor

ml_bp        = Blueprint("ml", __name__)
_predictor   = None

def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = SnakePredictor(
            model_path=current_app.config["MODEL_PATH"],
            input_size=current_app.config.get("MODEL_INPUT_SIZE", (224, 224)),
            threshold=current_app.config.get("CONFIDENCE_THRESHOLD", 0.65)
        )
    return _predictor


def allowed_file(filename):
    allowed = current_app.config.get(
        "ALLOWED_EXTENSIONS", {"jpg", "jpeg", "png", "webp"}
    )
    return ('.' in filename and
            filename.rsplit('.', 1)[-1].lower() in allowed)


@ml_bp.route("/api/identify", methods=["POST"])
def identify_snake():
    """
    POST /api/identify
    Content-Type: multipart/form-data
    Fields:
        image      : file (required)
        lat        : float (optional)
        lng        : float (optional)
        session_id : string (optional)
    """

    # ── 1. Validate image ────────────────────────────────────────────────
    if "image" not in request.files:
        return error_response(
            "No image provided. Send image as multipart/form-data "
            "with field name 'image'", 400
        )

    file = request.files["image"]

    if file.filename == "":
        return error_response("No file selected", 400)

    if not allowed_file(file.filename):
        return error_response(
            "Invalid file type. Allowed: jpg, jpeg, png, webp", 400
        )

    # ── 2. Save to temp file ─────────────────────────────────────────────
    ext      = file.filename.rsplit('.', 1)[-1].lower()
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=f".{ext}"
        ) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # ── 3. Run ML prediction ─────────────────────────────────────────
        predictor = get_predictor()
        result    = predictor.predict(tmp_path)

        # ── 4. Fetch full snake data from MongoDB ────────────────────────
        db    = current_app.db
        snake = db.snakes.find_one(
            {"slug": result["slug"]},
            {"_id": 0}
        )

        if not snake:
            current_app.logger.warning(
                f"Predicted slug '{result['slug']}' not found in DB. "
                f"Check that seed_data.py has been run and slugs match "
                f"SNAKE_LABELS in ml/labels.py"
            )
            return error_response(
                f"Identified species not found in database. "
                f"Please try again with a clearer photo.", 404
            )

        # ── 5. Fetch similar species ─────────────────────────────────────
        similar = []
        if snake.get("similar_species"):
            similar = list(db.snakes.find(
                {"slug": {"$in": snake["similar_species"]}},
                {
                    "slug": 1, "common_name": 1,
                    "is_venomous": 1, "thumbnail": 1,
                    "_id": 0
                }
            ))

        # ── 6. Log incident anonymously ──────────────────────────────────
        incident_id = None
        lat = request.form.get("lat")
        lng = request.form.get("lng")

        if lat and lng:
            try:
                incident = {
                    "snake_identified": result["slug"],
                    "confidence_score": result["confidence"],
                    "was_bite"        : False,
                    "outcome"         : "unknown",
                    "location"        : {
                        "type"       : "Point",
                        "coordinates": [float(lng), float(lat)]
                    },
                    "timestamp" : datetime.utcnow(),
                    "session_id": request.form.get(
                        "session_id",
                        request.headers.get("X-Session-ID",
                                            str(uuid.uuid4()))
                    )
                }
                inc         = db.incidents.insert_one(incident)
                incident_id = str(inc.inserted_id)
            except Exception as e:
                # Never fail identification because of logging error
                current_app.logger.warning(f"Incident log failed: {e}")

        # ── 7. Build response matching frontend contract ──────────────────
        response_data = {
            "snake": {
                # All snake fields from MongoDB
                **snake,
                # Add ML-specific fields
                "confidence"  : result["confidence"],
                "is_uncertain": result["is_uncertain"],
            },
            "similar_species" : similar,
            "top_predictions" : result["top_predictions"],
            "incident_id"     : incident_id
        }

        return success_response(response_data)

    except RuntimeError as e:
        current_app.logger.error(f"ML prediction error: {e}")
        return error_response(
            "Identification failed. Please try again with a "
            "clearer, well-lit photo of the snake.", 500
        )

    except Exception as e:
        current_app.logger.error(f"Unexpected error in /identify: {e}")
        return error_response("Something went wrong. Please try again.", 500)

    finally:
        # Always delete temp file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


@ml_bp.route("/api/identify/health", methods=["GET"])
def model_health():
    """GET /api/identify/health — Check if model is loaded"""
    predictor = get_predictor()
    status    = predictor.health_check()
    return success_response(status)
