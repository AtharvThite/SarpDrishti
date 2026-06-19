import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Please install deep-translator first: pip install deep-translator")
    sys.exit(1)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "sarpdrishti")

def translate_text(text, target_lang):
    if not text or not isinstance(text, str):
        return text
    if text.startswith("http") or text.isdigit() or len(text) < 2:
        return text
        
    try:
        return GoogleTranslator(source='auto', target=target_lang).translate(text)
    except Exception as e:
        print(f"Translation failed for '{text[:20]}...': {e}")
        return text

def recursive_translate(val, lang):
    """Recursively translates strings, lists of strings, and dicts."""
    if val is None:
        return None
    if isinstance(val, str):
        return translate_text(val, lang)
    elif isinstance(val, list):
        if len(val) > 0 and isinstance(val[0], dict):
            return [{k: recursive_translate(v, lang) for k, v in item.items()} for item in val]
        return [recursive_translate(item, lang) for item in val]
    elif isinstance(val, dict):
        return {k: recursive_translate(v, lang) for k, v in val.items()}
    return val

def translate():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("Translating snakes in DB... This will take a few minutes as it connects to Google Translate.")
    snakes = list(db.snakes.find())
    
    languages = {"hi": "hi", "mr": "mr", "ta": "ta", "te": "te", "kn": "kn", "bn": "bn"}
    fields_to_translate = [
        "common_name", "common_name_regional", "habitat", "diet", "distribution",
        "behavior", "ecological_role", "did_you_know", 
        "first_aid", "interesting_facts", "benefits_to_humans",
        "myths_and_facts", "appearance"
    ]
    
    for snake in snakes:
        slug = snake.get("slug")
        print(f"Translating {slug}...")
        translations = {}
        
        for lang_code, google_lang in languages.items():
            lang_data = {}
            for field in fields_to_translate:
                if field in snake and snake[field]:
                    lang_data[field] = recursive_translate(snake[field], google_lang)
            translations[lang_code] = lang_data
            
        db.snakes.update_one({"_id": snake["_id"]}, {"$set": {"translations": translations}})
        print(f"  -> {slug} updated successfully!")

    print("Translating rescuers in DB...")
    rescuers = db.rescuers.find()
    for rescuer in rescuers:
        translations = {}
        bio = rescuer.get("bio", f"{rescuer.get('name')} is a verified snake rescuer.")
        for lang_code, google_lang in languages.items():
            translations[lang_code] = {
                "bio": recursive_translate(bio, google_lang)
            }
        db.rescuers.update_one({"_id": rescuer["_id"]}, {"$set": {"translations": translations}})
    
    print("Database full translation successful!")

if __name__ == "__main__":
    translate()
