import os
import sys
from pymongo import MongoClient
import bcrypt
from datetime import datetime
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "sarpdrishti")

def create_indexes(db):
    db.snakes.create_index("slug", unique=True)
    db.snakes.create_index("is_venomous")
    db.snakes.create_index("distribution")
    db.snakes.create_index([("common_name", "text"), ("scientific_name", "text")])
    
    db.rescuers.create_index([("location", "2dsphere")])
    db.rescuers.create_index("is_verified")
    db.rescuers.create_index("is_available")
    db.rescuers.create_index("phone", unique=True)
    
    db.hospitals.create_index([("location", "2dsphere")])
    db.hospitals.create_index("has_antivenom")
    
    db.incidents.create_index([("location", "2dsphere")])
    db.incidents.create_index("timestamp")
    db.incidents.create_index("snake_identified")

def seed():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("Clearing existing data...")
    db.snakes.delete_many({})
    db.rescuers.delete_many({})
    db.hospitals.delete_many({})
    db.incidents.delete_many({})
    db.admins.delete_many({})

    print("Creating indexes...")
    create_indexes(db)

    print("Seeding snakes...")
    snakes = [
        # Non-Venomous
        {
            "slug": "banded-racer",
            "common_name": "Banded Racer",
            "common_name_regional": {"hindi": "Dhaman", "marathi": "Dhaman", "tamil": "Sarai Pambu", "telugu": "Jerri Pothu", "kannada": "Kere Havu", "bengali": "Darash"},
            "scientific_name": "Argyrogena fasciolata",
            "family": "Colubridae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 50, "max": 120},
            "appearance": {"colors": ["brown", "olive"], "pattern": "cross-bars", "head_shape": "narrow", "distinguishing_features": ["smooth scales", "large eyes"]},
            "habitat": ["scrublands", "agricultural fields", "dry forests"],
            "distribution": ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Madhya Pradesh", "Rajasthan"],
            "active_period": "diurnal",
            "behavior": "Fast-moving, aggressive when cornered, vibrates tail like a rattlesnake.",
            "diet": ["rodents", "frogs", "lizards"],
            "bite_symptoms": [],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash bite with soap and water", "Keep patient calm", "Seek medical attention if wound gets infected"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["common-rat-snake", "spectacled-cobra"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Banded+Racer",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "checkered-keelback",
            "common_name": "Checkered Keelback",
            "common_name_regional": {"hindi": "Dendu", "marathi": "Vidu", "tamil": "Thanni Pambu", "telugu": "Neeru Pamu", "kannada": "Neeru Havu", "bengali": "Jol Bora"},
            "scientific_name": "Fowlea piscator",
            "family": "Colubridae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 60, "max": 150},
            "appearance": {"colors": ["green", "yellow", "brown"], "pattern": "checkered squares", "head_shape": "distinct from neck", "distinguishing_features": ["keeled scales", "two black streaks behind eyes"]},
            "habitat": ["lakes", "rivers", "paddy fields", "wells"],
            "distribution": ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Odisha", "Bihar", "Uttar Pradesh", "Assam"],
            "active_period": "diurnal",
            "behavior": "Aggressive when handled, flattening neck and head. Excellent swimmer.",
            "diet": ["frogs", "fish"],
            "bite_symptoms": [],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash wound", "Disinfect", "Tetanus shot if necessary"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["green-tree-vine"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Checkered+Keelback",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "common-rat-snake",
            "common_name": "Common Rat Snake",
            "common_name_regional": {"hindi": "Dhaman", "marathi": "Dhaman", "tamil": "Sarai", "telugu": "Jerri", "kannada": "Kere", "bengali": "Darash"},
            "scientific_name": "Ptyas mucosa",
            "family": "Colubridae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 150, "max": 300},
            "appearance": {"colors": ["olive", "brown", "black", "yellowish"], "pattern": "cross-bars on posterior", "head_shape": "large eyes, pointed snout", "distinguishing_features": ["black margins on lower lip scales", "large size"]},
            "habitat": ["urban areas", "agricultural lands", "forests"],
            "distribution": ["All over India"],
            "active_period": "diurnal",
            "behavior": "Very fast, agile climber, aggressive when captured. Often mistaken for cobras.",
            "diet": ["rodents", "birds", "frogs"],
            "bite_symptoms": [],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash thoroughly", "Apply antiseptic"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["spectacled-cobra", "banded-racer"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Common+Rat+Snake",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "common-sand-boa",
            "common_name": "Common Sand Boa",
            "common_name_regional": {"hindi": "Mati Ka Saap", "marathi": "Mandol", "tamil": "Mann Pambu", "telugu": "Idupa Pamu", "kannada": "Mannu Havu", "bengali": "Bora"},
            "scientific_name": "Eryx conicus",
            "family": "Boidae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 40, "max": 100},
            "appearance": {"colors": ["brown", "grey", "yellowish"], "pattern": "irregular blotches", "head_shape": "blunt, not distinct", "distinguishing_features": ["stout body", "rough scaled tail", "keeled scales"]},
            "habitat": ["dry sandy areas", "scrub forests", "agricultural fields"],
            "distribution": ["Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
            "active_period": "nocturnal",
            "behavior": "Sluggish, burrows in sand, often mistaken for Russell's Viper due to coloration.",
            "diet": ["rodents", "birds", "lizards"],
            "bite_symptoms": [],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash wound", "Apply antiseptic"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["russells-viper", "saw-scaled-viper"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Common+Sand+Boa",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "common-trinket",
            "common_name": "Common Trinket",
            "common_name_regional": {"hindi": "Gahna", "marathi": "Alankar", "tamil": "Trinket", "telugu": "Trinket", "kannada": "Trinket", "bengali": "Trinket"},
            "scientific_name": "Coelognathus helena",
            "family": "Colubridae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 60, "max": 150},
            "appearance": {"colors": ["brown", "tan"], "pattern": "black and white bands/stripes", "head_shape": "distinct", "distinguishing_features": ["two black stripes on neck", "pearl-like spots"]},
            "habitat": ["forests", "bushes", "termitaria", "crevices"],
            "distribution": ["Maharashtra", "Karnataka", "Kerala", "Tamil Nadu", "Gujarat", "Madhya Pradesh", "Chhattisgarh"],
            "active_period": "diurnal",
            "behavior": "Aggressive when threatened, forms 'S' coils, bites viciously.",
            "diet": ["rodents", "small mammals", "lizards"],
            "bite_symptoms": [],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash wound thoroughly", "Apply antiseptic"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["banded-racer"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Common+Trinket",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "green-tree-vine",
            "common_name": "Green Tree Vine",
            "common_name_regional": {"hindi": "Hara Saap", "marathi": "Harantol", "tamil": "Pachai Pambu", "telugu": "Pachari Pamu", "kannada": "Hasiru Havu", "bengali": "Laudoga"},
            "scientific_name": "Ahaetulla nasuta",
            "family": "Colubridae",
            "is_venomous": False,
            "venom_type": None, # Mildly venomous but not dangerous to humans
            "venom_severity": None,
            "size_range_cm": {"min": 100, "max": 200},
            "appearance": {"colors": ["bright green", "yellowish"], "pattern": "solid", "head_shape": "pointed snout", "distinguishing_features": ["horizontal pupils", "very slender body"]},
            "habitat": ["trees", "bushes", "forests", "gardens"],
            "distribution": ["Western Ghats", "Maharashtra", "Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal", "Assam"],
            "active_period": "diurnal",
            "behavior": "Arboreal, excellent camouflage, sways with the wind, strikes if provoked.",
            "diet": ["frogs", "lizards", "small birds"],
            "bite_symptoms": ["mild swelling", "pain at bite site"],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Wash wound", "Disinfect"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["bamboo-pit-viper"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Green+Tree+Vine",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "indian-rock-python",
            "common_name": "Indian Rock Python",
            "common_name_regional": {"hindi": "Ajgar", "marathi": "Ajgar", "tamil": "Malai Pambu", "telugu": "Konda Chiluka", "kannada": "Hebhavu", "bengali": "Ajagar"},
            "scientific_name": "Python molurus",
            "family": "Pythonidae",
            "is_venomous": False,
            "venom_type": None,
            "venom_severity": None,
            "size_range_cm": {"min": 250, "max": 600},
            "appearance": {"colors": ["yellowish", "brown", "grey"], "pattern": "irregular blotches", "head_shape": "distinct, lance-shaped", "distinguishing_features": ["massive size", "heat-sensing pits on lips"]},
            "habitat": ["forests", "rocky outcrops", "wetlands"],
            "distribution": ["All over India"],
            "active_period": "nocturnal",
            "behavior": "Slow-moving, constrictor, good swimmer and climber. Ambush predator.",
            "diet": ["mammals", "birds", "reptiles"],
            "bite_symptoms": ["lacerations", "bleeding"],
            "time_to_symptoms_hours": {"min": 0, "max": 0},
            "first_aid": ["Stop bleeding", "Clean wound thoroughly", "Seek medical care for stitches"],
            "antivenom": "Not required",
            "hospital_urgency": "within_4hr",
            "similar_species": ["russells-viper"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Indian+Rock+Python",
            "iucn_status": "Near Threatened",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Venomous
        {
            "slug": "common-krait",
            "common_name": "Common Krait",
            "common_name_regional": {"hindi": "Krait", "marathi": "Manyar", "tamil": "Kattu Viriyan", "telugu": "Kattu Pamu", "kannada": "Kattuka Havu", "bengali": "Kalach"},
            "scientific_name": "Bungarus caeruleus",
            "family": "Elapidae",
            "is_venomous": True,
            "venom_type": "neurotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 90, "max": 150},
            "appearance": {"colors": ["black", "bluish-black"], "pattern": "narrow white bands", "head_shape": "not distinct from neck", "distinguishing_features": ["enlarged hexagonal scales along spine", "smooth scales"]},
            "habitat": ["fields", "scrub jungles", "termite mounds", "human habitations"],
            "distribution": ["All over India"],
            "active_period": "nocturnal",
            "behavior": "Docile during the day, highly active and aggressive at night. Often bites people sleeping on floor.",
            "diet": ["snakes", "mice", "frogs"],
            "bite_symptoms": ["paralysis", "stomach pain", "breathing difficulty", "ptosis (drooping eyelids)", "no pain at bite site"],
            "time_to_symptoms_hours": {"min": 1, "max": 6},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)",
            "hospital_urgency": "immediate",
            "similar_species": ["common-wolf-snake"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Common+Krait",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "king-cobra",
            "common_name": "King Cobra",
            "common_name_regional": {"hindi": "Raj Nag", "marathi": "Raj Nag", "tamil": "Karum Nagam", "telugu": "Raja Nagu", "kannada": "Kalinga Sarpa", "bengali": "Shankhachur"},
            "scientific_name": "Ophiophagus hannah",
            "family": "Elapidae",
            "is_venomous": True,
            "venom_type": "neurotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 300, "max": 550},
            "appearance": {"colors": ["olive-green", "tan", "black"], "pattern": "pale bands", "head_shape": "large, robust", "distinguishing_features": ["massive size", "narrow hood without spectacles", "large occipital scales"]},
            "habitat": ["dense forests", "bamboo thickets", "mangrove swamps", "tea estates"],
            "distribution": ["Western Ghats", "Northeast India", "Odisha", "Andaman Islands"],
            "active_period": "diurnal",
            "behavior": "Intelligent, raises one-third of body, builds nests, extremely dangerous.",
            "diet": ["other snakes", "monitor lizards"],
            "bite_symptoms": ["rapid paralysis", "respiratory failure", "severe pain", "swelling", "blurred vision", "vertigo"],
            "time_to_symptoms_hours": {"min": 0.5, "max": 2},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)", # Specific King Cobra AV is rare, polyvalent used
            "hospital_urgency": "immediate",
            "similar_species": ["common-rat-snake"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=King+Cobra",
            "iucn_status": "Vulnerable",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "monocled-cobra",
            "common_name": "Monocled Cobra",
            "common_name_regional": {"hindi": "Nag", "marathi": "Nag", "tamil": "Nagam", "telugu": "Nagu Pamu", "kannada": "Nagara Havu", "bengali": "Keute"},
            "scientific_name": "Naja kaouthia",
            "family": "Elapidae",
            "is_venomous": True,
            "venom_type": "neurotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 130, "max": 230},
            "appearance": {"colors": ["yellow", "brown", "black"], "pattern": "plain or banded", "head_shape": "distinct from neck", "distinguishing_features": ["O-shaped (monocle) mark on hood"]},
            "habitat": ["wetlands", "paddy fields", "forests", "human habitations"],
            "distribution": ["West Bengal", "Odisha", "Bihar", "Northeast India"],
            "active_period": "crepuscular",
            "behavior": "Aggressive, flares hood with a single ring mark, strikes readily.",
            "diet": ["rodents", "frogs", "toads"],
            "bite_symptoms": ["paralysis", "breathing difficulty", "severe pain", "tissue necrosis at bite site", "ptosis"],
            "time_to_symptoms_hours": {"min": 0.5, "max": 2},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)",
            "hospital_urgency": "immediate",
            "similar_species": ["spectacled-cobra", "common-rat-snake"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Monocled+Cobra",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "russells-viper",
            "common_name": "Russell's Viper",
            "common_name_regional": {"hindi": "Koriwala", "marathi": "Ghonas", "tamil": "Kannadi Viriyan", "telugu": "Raktha Penjara", "kannada": "Mandalada Havu", "bengali": "Chandrabora"},
            "scientific_name": "Daboia russelii",
            "family": "Viperidae",
            "is_venomous": True,
            "venom_type": "hemotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 100, "max": 180},
            "appearance": {"colors": ["brown", "yellow", "sandy"], "pattern": "three rows of reddish-brown oval spots", "head_shape": "triangular", "distinguishing_features": ["stout body", "keeled scales", "loud hissing sound"]},
            "habitat": ["open grasslands", "scrublands", "farmlands", "plantations"],
            "distribution": ["All over India"],
            "active_period": "nocturnal",
            "behavior": "Extremely aggressive, strikes incredibly fast, hisses loudly like a pressure cooker.",
            "diet": ["rodents", "small mammals", "birds"],
            "bite_symptoms": ["severe pain", "swelling", "bleeding from gums/wounds", "kidney failure", "blood doesn't clot"],
            "time_to_symptoms_hours": {"min": 0.5, "max": 1},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)",
            "hospital_urgency": "immediate",
            "similar_species": ["common-sand-boa", "indian-rock-python"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Russell's+Viper",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "saw-scaled-viper",
            "common_name": "Saw-scaled Viper",
            "common_name_regional": {"hindi": "Afai", "marathi": "Furse", "tamil": "Suruttai Pambu", "telugu": "Rampa Porusu Pamu", "kannada": "Kallu Havu", "bengali": "Bora"},
            "scientific_name": "Echis carinatus",
            "family": "Viperidae",
            "is_venomous": True,
            "venom_type": "hemotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 30, "max": 80},
            "appearance": {"colors": ["brown", "grey", "sandy"], "pattern": "zigzag pattern, bird-foot mark on head", "head_shape": "pear-shaped", "distinguishing_features": ["small size", "rub scales to make sizzling sound"]},
            "habitat": ["dry areas", "rocky regions", "sandy tracts"],
            "distribution": ["Rajasthan", "Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
            "active_period": "nocturnal",
            "behavior": "Very aggressive, forms 'figure 8' coils, strikes fast, rubs scales to produce a warning sound.",
            "diet": ["insects", "scorpions", "lizards", "frogs", "mice"],
            "bite_symptoms": ["swelling", "pain", "bleeding from gums", "blood in urine", "incoagulable blood"],
            "time_to_symptoms_hours": {"min": 1, "max": 4},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)",
            "hospital_urgency": "immediate",
            "similar_species": ["common-sand-boa"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Saw-scaled+Viper",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "slug": "spectacled-cobra",
            "common_name": "Spectacled Cobra",
            "common_name_regional": {"hindi": "Nag", "marathi": "Nag", "tamil": "Nalla Pambu", "telugu": "Nagu Pamu", "kannada": "Nagara Havu", "bengali": "Gokhro"},
            "scientific_name": "Naja naja",
            "family": "Elapidae",
            "is_venomous": True,
            "venom_type": "neurotoxic",
            "venom_severity": "deadly",
            "size_range_cm": {"min": 100, "max": 220},
            "appearance": {"colors": ["brown", "black", "yellow", "grey"], "pattern": "spectacle mark on hood", "head_shape": "distinct from neck", "distinguishing_features": ["expandable hood", "U-shaped spectacle mark"]},
            "habitat": ["forests", "agricultural lands", "urban areas", "near water bodies"],
            "distribution": ["All over India"],
            "active_period": "crepuscular",
            "behavior": "Flares hood when threatened, hisses loudly. Bites are mostly defensive.",
            "diet": ["rodents", "toads", "frogs", "birds"],
            "bite_symptoms": ["paralysis", "breathing difficulty", "severe pain", "swelling", "tissue necrosis", "ptosis"],
            "time_to_symptoms_hours": {"min": 0.5, "max": 2},
            "first_aid": ["Keep patient calm", "Immobilize bitten limb", "Transport to hospital IMMEDIATELY", "Do NOT apply tourniquet", "Do NOT cut or suck wound"],
            "antivenom": "Polyvalent Anti-Snake Venom (ASV)",
            "hospital_urgency": "immediate",
            "similar_species": ["common-rat-snake", "banded-racer"],
            "images": [],
            "thumbnail": "https://placehold.co/400x300/1A3A2A/white?text=Spectacled+Cobra",
            "iucn_status": "Least Concern",
            "is_protected": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    db.snakes.insert_many(snakes)

    print("Seeding rescuers...")
    rescuers = [
        {
            "name": "Ramesh Kumar",
            "phone": "+919876543210",
            "whatsapp": "+919876543210",
            "email": "ramesh@example.com",
            "location": {"type": "Point", "coordinates": [72.8777, 19.0760]}, # Mumbai
            "address": "Andheri West, Mumbai",
            "districts_covered": ["Mumbai", "Thane", "Palghar"],
            "service_radius_km": 30,
            "is_available": True,
            "is_verified": True,
            "is_active": True,
            "experience_years": 8,
            "organization": "Mumbai Snake Rescuers",
            "certifications": ["Basic Herpetology", "First Aid"],
            "profile_photo": None,
            "bio": "Passionate rescuer with 8 years of experience in urban snake rescues.",
            "rating": 4.8,
            "total_rescues": 1240,
            "reviews": [],
            "availability_hours": {"is_24x7": True, "start": "00:00", "end": "23:59"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        },
        {
            "name": "Suresh Patil",
            "phone": "+919876543211",
            "whatsapp": "+919876543211",
            "email": "suresh@example.com",
            "location": {"type": "Point", "coordinates": [73.8567, 18.5204]}, # Pune
            "address": "Kothrud, Pune",
            "districts_covered": ["Pune", "Satara"],
            "service_radius_km": 50,
            "is_available": False,
            "is_verified": True,
            "is_active": True,
            "experience_years": 12,
            "organization": "Wildlife SOS",
            "certifications": ["Expert Handler"],
            "profile_photo": None,
            "bio": "Specialized in venomous snake rescues and relocation.",
            "rating": 4.9,
            "total_rescues": 2100,
            "reviews": [],
            "availability_hours": {"is_24x7": False, "start": "08:00", "end": "20:00"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        },
        {
            "name": "Amit Sharma",
            "phone": "+919876543212",
            "whatsapp": "+919876543212",
            "email": "amit@example.com",
            "location": {"type": "Point", "coordinates": [79.0882, 21.1458]}, # Nagpur
            "address": "Dharampeth, Nagpur",
            "districts_covered": ["Nagpur", "Wardha"],
            "service_radius_km": 40,
            "is_available": True,
            "is_verified": True,
            "is_active": True,
            "experience_years": 5,
            "organization": "",
            "certifications": [],
            "profile_photo": None,
            "bio": "Helping farmers and urban residents deal with snake encounters safely.",
            "rating": 4.5,
            "total_rescues": 450,
            "reviews": [],
            "availability_hours": {"is_24x7": False, "start": "06:00", "end": "18:00"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        },
        {
            "name": "Priya Singh",
            "phone": "+919876543213",
            "whatsapp": "+919876543213",
            "email": "priya@example.com",
            "location": {"type": "Point", "coordinates": [77.5946, 12.9716]}, # Bangalore
            "address": "Indiranagar, Bangalore",
            "districts_covered": ["Bangalore Urban", "Bangalore Rural"],
            "service_radius_km": 35,
            "is_available": False,
            "is_verified": True,
            "is_active": True,
            "experience_years": 6,
            "organization": "Bangalore Reptile Rescue",
            "certifications": ["Advanced Herpetology"],
            "profile_photo": None,
            "bio": "Educator and rescuer focused on snake conservation.",
            "rating": 4.7,
            "total_rescues": 890,
            "reviews": [],
            "availability_hours": {"is_24x7": True, "start": "00:00", "end": "23:59"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        },
        {
            "name": "Vikram Deshmukh",
            "phone": "+919876543214",
            "whatsapp": "+919876543214",
            "email": "vikram@example.com",
            "location": {"type": "Point", "coordinates": [73.7898, 19.9975]}, # Nashik
            "address": "Panchavati, Nashik",
            "districts_covered": ["Nashik", "Ahmednagar"],
            "service_radius_km": 60,
            "is_available": True,
            "is_verified": True,
            "is_active": True,
            "experience_years": 15,
            "organization": "Nature Conservers Nashik",
            "certifications": ["Forest Dept Certified Handler"],
            "profile_photo": None,
            "bio": "Veteran snake rescuer working closely with forest department.",
            "rating": 5.0,
            "total_rescues": 3500,
            "reviews": [],
            "availability_hours": {"is_24x7": True, "start": "00:00", "end": "23:59"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        },
        {
            "name": "Sneha Joshi",
            "phone": "+919876543215",
            "whatsapp": "+919876543215",
            "email": "sneha@example.com",
            "location": {"type": "Point", "coordinates": [72.9781, 19.1963]}, # Thane
            "address": "Naupada, Thane",
            "districts_covered": ["Thane", "Mumbai Suburban"],
            "service_radius_km": 20,
            "is_available": False,
            "is_verified": True,
            "is_active": True,
            "experience_years": 3,
            "organization": "",
            "certifications": ["First Aid Level 1"],
            "profile_photo": None,
            "bio": "Young, enthusiastic rescuer dedicated to wildlife.",
            "rating": 4.3,
            "total_rescues": 120,
            "reviews": [],
            "availability_hours": {"is_24x7": False, "start": "09:00", "end": "17:00"},
            "created_at": datetime.utcnow(),
            "last_seen": datetime.utcnow()
        }
    ]
    db.rescuers.insert_many(rescuers)

    print("Seeding hospitals...")
    hospitals = [
        {
            "name": "KEM Hospital",
            "type": "government",
            "address": "Parel, Mumbai",
            "district": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400012",
            "location": {"type": "Point", "coordinates": [72.8397, 19.0033]},
            "emergency_number": "022-24107000",
            "general_number": "022-24107001",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=19.0033,72.8397",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Sassoon General Hospital",
            "type": "government",
            "address": "Station Road, Pune",
            "district": "Pune",
            "state": "Maharashtra",
            "pincode": "411001",
            "location": {"type": "Point", "coordinates": [73.8741, 18.5284]},
            "emergency_number": "020-26128000",
            "general_number": "020-26128001",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=18.5284,73.8741",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Government Medical College and Hospital",
            "type": "government",
            "address": "Hanuman Nagar, Nagpur",
            "district": "Nagpur",
            "state": "Maharashtra",
            "pincode": "440003",
            "location": {"type": "Point", "coordinates": [79.0970, 21.1350]},
            "emergency_number": "0712-2701100",
            "general_number": "0712-2701101",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=21.1350,79.0970",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Civil Hospital Nashik",
            "type": "government",
            "address": "Trimbak Road, Nashik",
            "district": "Nashik",
            "state": "Maharashtra",
            "pincode": "422002",
            "location": {"type": "Point", "coordinates": [73.7745, 19.9995]},
            "emergency_number": "0253-2576100",
            "general_number": "0253-2576101",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=19.9995,73.7745",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Victoria Hospital",
            "type": "government",
            "address": "K.R. Market, Bangalore",
            "district": "Bangalore Urban",
            "state": "Karnataka",
            "pincode": "560002",
            "location": {"type": "Point", "coordinates": [77.5738, 12.9634]},
            "emergency_number": "080-26701150",
            "general_number": "080-26701151",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=12.9634,77.5738",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Rajiv Gandhi Government General Hospital",
            "type": "government",
            "address": "Park Town, Chennai",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600003",
            "location": {"type": "Point", "coordinates": [80.2785, 13.0827]},
            "emergency_number": "044-25305000",
            "general_number": "044-25305001",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=13.0827,80.2785",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Civil Hospital Ahmedabad",
            "type": "government",
            "address": "Asarwa, Ahmedabad",
            "district": "Ahmedabad",
            "state": "Gujarat",
            "pincode": "380016",
            "location": {"type": "Point", "coordinates": [72.6030, 23.0526]},
            "emergency_number": "079-22683721",
            "general_number": "079-22683722",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=23.0526,72.6030",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Calcutta Medical College",
            "type": "government",
            "address": "College Street, Kolkata",
            "district": "Kolkata",
            "state": "West Bengal",
            "pincode": "700073",
            "location": {"type": "Point", "coordinates": [88.3639, 22.5760]},
            "emergency_number": "033-22123700",
            "general_number": "033-22123701",
            "has_antivenom": True,
            "antivenom_info": {"type": "polyvalent", "is_free": True, "last_verified": datetime.utcnow()},
            "has_icu": True,
            "has_24hr_emergency": True,
            "google_maps_url": "https://maps.google.com/?q=22.5760,88.3639",
            "created_at": datetime.utcnow()
        }
    ]
    db.hospitals.insert_many(hospitals)

    print("Seeding admin...")
    password = b"Admin@1234"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    
    admin = {
        "email": "admin@sarpdrishti.in",
        "password_hash": hashed,
        "role": "superadmin",
        "created_at": datetime.utcnow()
    }
    db.admins.insert_one(admin)

    print("Summary:")
    print(f"- Snakes: {db.snakes.count_documents({})}")
    print(f"- Rescuers: {db.rescuers.count_documents({})}")
    print(f"- Hospitals: {db.hospitals.count_documents({})}")
    print(f"- Admins: {db.admins.count_documents({})}")
    print("✅ Database seeded successfully")

if __name__ == "__main__":
    seed()
