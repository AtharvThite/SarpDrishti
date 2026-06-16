from flask import current_app

def get_collection():
    return current_app.db.incidents
