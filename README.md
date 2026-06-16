# SarpDrishti 🐍

SarpDrishti is an intelligent Indian snake identification and emergency response web platform. It utilizes a trained TensorFlow/Keras Machine Learning model to identify snakes from user-uploaded images, cross-references against a MongoDB database of Indian snake species, and provides instant emergency guidance, nearby hospital locations, and contacts for local wildlife rescuers.

## 🌟 Key Features

- **AI Snake Identification:** Upload a photo and instantly identify the snake species using a trained ML model.
- **Encyclopedia:** A comprehensive database of venomous and non-venomous snakes found across India, complete with habitats, distributions, and bite symptoms.
- **Emergency Guide & Hospital Finder:** A critical first-aid guide outlining exactly what to do (and what not to do) in the event of a bite, alongside a district-based hospital finder equipped with Anti-Snake Venom (ASV).
- **Rescuer Network:** A directory of verified local snake rescuers with quick links to call or WhatsApp them.

---

## 🛠 Technology Stack

### Frontend
- **React + Vite:** Lightning-fast development and optimized production builds.
- **Custom CSS / Glassmorphism:** Rich, modern, dynamic aesthetic with custom utility classes.
- **Axios:** For handling API requests.
- **Lucide React:** Beautiful, consistent iconography.

### Backend
- **Python 3.11 & Flask 3.0:** Robust backend architecture using Flask Blueprints and an App Factory pattern.
- **MongoDB (PyMongo):** Direct, high-performance database interactions utilizing geospatial indexing for location-based rescuer and hospital lookups.
- **TensorFlow 2.15:** For running inference on the snake classification ML model.
- **Authentication & Security:** bcrypt for password hashing and PyJWT for secure admin authentication.

---

## 🚀 Setup Guide

Follow these instructions to run the SarpDrishti platform locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python 3.11 (Required specifically for TensorFlow 2.15 compatibility)
- MongoDB Atlas Cluster (or a local MongoDB instance)

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

**Create and activate a virtual environment:**
```bash
# On Linux/macOS
python3.11 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` directory (you can copy `.env.example` if available) and add the following:
```env
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000

# Replace with your actual MongoDB URI. URL-encode your password if it contains special characters.
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.vhatm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=sarpdrishti

# Generate a strong random string for JWT
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# (Optional) Cloudinary credentials if you are testing image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Seed the Database:**
Populate your MongoDB database with the initial set of snakes, rescuers, and hospitals:
```bash
python seed/seed_data.py
```

**Start the Flask Server:**
```bash
python app.py
```
*The backend will now be running on `http://localhost:5000`.*

### 2. ML Model Configuration
By default, if the actual TensorFlow model weights are missing, the backend safely falls back to a **Mock Mode** (returning simulated predictions). 

To enable real AI inference:
1. Place your trained `.keras` or `.h5` model file in the `backend/ml/weights/` directory.
2. Ensure the file is named `snake_model.keras` (or update the filename reference in `backend/ml/predictor.py`).

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

**Install Node dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

**Start the Vite Development Server:**
```bash
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## 🏗 Project Structure

```
SarpDrishti/
├── backend/
│   ├── app.py                # Flask application factory
│   ├── ml/                   # Machine Learning predictor & weights
│   ├── routes/               # API Blueprints (snakes, rescuers, hospitals, ml)
│   ├── seed/                 # Database seeding scripts
│   ├── services/             # Image processing & Cloudinary services
│   ├── utils/                # Standardized JSON responses & validators
│   └── requirements.txt      # Python dependencies
└── frontend/
    ├── index.html            # Main HTML entry point
    ├── src/
    │   ├── components/       # Reusable React components (Cards, Badges, Loaders)
    │   ├── pages/            # View pages (Home, Identify, Emergency, Rescuers)
    │   ├── index.css         # Global styles and design system tokens
    │   └── App.jsx           # Routing and Layout
    └── package.json          # Node dependencies
```

## 📜 License
This project is for educational and emergency assistance purposes. Ensure local wildlife rescue guidelines are adhered to when using this platform.
