import os
import numpy as np
from PIL import Image
from .labels import SNAKE_LABELS, SNAKE_METADATA

class SnakePredictor:
    def __init__(self, model_path=None):
        self.model = None
        self.mock_mode = False
        
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
        
        if not model_path:
            model_path = os.getenv("MODEL_PATH", "ml/weights/snake_model.keras")

        try:
            import tensorflow as tf
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
            else:
                print(f"WARNING: Model file not found at {model_path}. Using mock mode.")
                self.mock_mode = True
        except Exception as e:
            print(f"WARNING: Failed to load ML model: {str(e)}. Using mock mode.")
            self.mock_mode = True

    def preprocess(self, image_path):
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)

    def predict(self, image_path, confidence_threshold=0.65):
        if self.mock_mode:
            return {
                "slug": "spectacled-cobra",
                "confidence": 0.87,
                "is_uncertain": False,
                "top_predictions": [
                    {"slug": "spectacled-cobra", "common_name": "Spectacled Cobra", "confidence": 0.87},
                    {"slug": "monocled-cobra", "common_name": "Monocled Cobra", "confidence": 0.08},
                    {"slug": "indian-rock-python", "common_name": "Indian Rock Python", "confidence": 0.05}
                ]
            }

        try:
            processed_img = self.preprocess(image_path)
            predictions = self.model.predict(processed_img, verbose=0)[0]
            
            top_3_idx = np.argsort(predictions)[-3:][::-1]
            
            top_predictions = []
            for idx in top_3_idx:
                label = SNAKE_LABELS[idx]
                meta = SNAKE_METADATA[label]
                top_predictions.append({
                    "slug": meta["slug"],
                    "common_name": label,
                    "confidence": float(predictions[idx])
                })
                
            best_pred = top_predictions[0]
            is_uncertain = best_pred["confidence"] < confidence_threshold
            
            return {
                "slug": best_pred["slug"],
                "confidence": best_pred["confidence"],
                "is_uncertain": is_uncertain,
                "top_predictions": top_predictions
            }
            
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {str(e)}")

predictor = SnakePredictor()
