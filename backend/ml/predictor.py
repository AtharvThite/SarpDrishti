import os
import numpy as np
import tempfile
from PIL import Image
from ml.labels import SNAKE_LABELS, VENOMOUS_CLASSES, SNAKE_METADATA

# ── Lazy-load model once on first prediction ─────────────────────────────
_model       = None
_model_path  = None

def get_model(model_path):
    global _model, _model_path
    if _model is None:
        try:
            import tensorflow as tf
            from tensorflow.keras.models import load_model
            print(f"⏳ Loading snake model from {model_path}...")
            _model      = load_model(model_path)
            _model_path = model_path
            print(f"✅ Snake model loaded successfully")
            print(f"   Input shape  : {_model.input_shape}")
            print(f"   Output shape : {_model.output_shape}")
            print(f"   Classes      : {_model.output_shape[-1]}")
        except Exception as e:
            print(f"⚠️  Model load failed: {e}")
            print(f"⚠️  Running in MOCK mode")
            _model = "mock"
    return _model


def preprocess_image(image_path, input_size=(224, 224)):
    """
    Preprocessing MUST match training exactly.
    Training used: EfficientNet preprocess_input → range [-1, 1]
    NOT /255.0 → that caused the Monocled Cobra bug
    """
    from tensorflow.keras.applications.efficientnet import preprocess_input

    img = Image.open(image_path).convert('RGB')
    img = img.resize(input_size, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)

    # EfficientNet-specific preprocessing — same as training
    arr = preprocess_input(arr)

    # Add batch dimension → (1, 224, 224, 3)
    return np.expand_dims(arr, axis=0)


def slug_from_name(name):
    """Russell's Viper → russells-viper"""
    return name.lower().replace("'", "").replace(" ", "-")


class SnakePredictor:

    def __init__(self, model_path, input_size=(224, 224), threshold=0.65):
        self.model_path  = model_path
        self.input_size  = input_size
        self.threshold   = threshold
        self.labels      = SNAKE_LABELS
        self.venomous    = VENOMOUS_CLASSES
        self.metadata    = SNAKE_METADATA

    def _get_model(self):
        return get_model(self.model_path)

    def predict(self, image_path):
        """
        Main prediction function.
        Returns dict matching the frontend contract exactly.
        """
        model = self._get_model()

        # Mock mode — model file not found
        if model == "mock":
            return self._mock_prediction()

        try:
            # Preprocess
            arr = preprocess_image(image_path, self.input_size)

            # Inference
            preds    = model.predict(arr, verbose=0)[0]
            top3_idx = np.argsort(preds)[::-1][:3]
            top_idx  = int(top3_idx[0])
            top_conf = float(preds[top_idx])
            top_name = self.labels[top_idx]

            return {
                "slug"           : slug_from_name(top_name),
                "confidence"     : round(top_conf, 3),
                "is_uncertain"   : top_conf < self.threshold,
                "top_predictions": [
                    {
                        "slug"        : slug_from_name(self.labels[i]),
                        "common_name" : self.labels[i],
                        "confidence"  : round(float(preds[i]), 3)
                    }
                    for i in top3_idx
                ]
            }

        except Exception as e:
            raise RuntimeError(f"Prediction failed: {str(e)}")

    def _mock_prediction(self):
        """
        Returned when model file is missing.
        Useful for testing backend without model.
        """
        return {
            "slug"           : "spectacled-cobra",
            "confidence"     : 0.87,
            "is_uncertain"   : False,
            "top_predictions": [
                {
                    "slug"       : "spectacled-cobra",
                    "common_name": "Spectacled Cobra",
                    "confidence" : 0.87
                },
                {
                    "slug"       : "monocled-cobra",
                    "common_name": "Monocled Cobra",
                    "confidence" : 0.08
                },
                {
                    "slug"       : "king-cobra",
                    "common_name": "King Cobra",
                    "confidence" : 0.03
                }
            ]
        }

    def health_check(self):
        """Called by /api/health to check model status."""
        model = self._get_model()
        if model == "mock":
            return {
                "status" : "mock_mode",
                "message": "Model file not found — using mock predictions",
                "path"   : self.model_path
            }
        return {
            "status"      : "loaded",
            "message"     : "Model loaded and ready",
            "path"        : self.model_path,
            "input_shape" : str(model.input_shape),
            "num_classes" : model.output_shape[-1]
        }
