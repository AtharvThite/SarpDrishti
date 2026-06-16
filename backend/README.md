# SarpDrishti Backend

## Prerequisites
- Python 3.11
- MongoDB 7.0 (local or Atlas URI)
- (Optional) Trained model file at ml/weights/snake_model.keras

## Setup

# 1. Clone and enter directory
cd sarpdrishti-backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\\Scripts\\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Open .env and set MONGO_URI and other values

# 5. Seed the database
python -m seed.seed_data

# 6. Run development server
python app.py
# Runs at http://localhost:5000

# 7. Test health
curl http://localhost:5000/api/health

## Production
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"

## Place ML Model
Copy sarpdrishti_snake_model.keras to:
ml/weights/snake_model.keras
Backend auto-detects and loads it on next restart.
Without the model file, backend runs in mock mode.
