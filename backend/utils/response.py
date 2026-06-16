from flask import jsonify
import math

def success_response(data=None):
    if data is None:
        data = {}
        
    if isinstance(data, dict):
        response_dict = {"success": True}
        response_dict.update(data)
        return jsonify(response_dict)
        
    return jsonify({
        "success": True,
        "data": data
    })

def error_response(error_message, status_code=400):
    response = jsonify({
        "success": False,
        "error": error_message
    })
    return response, status_code

def paginated_response(items, page, limit, total, key_name="items"):
    pages = math.ceil(total / limit) if limit > 0 else 1
    return jsonify({
        "success": True,
        key_name: items,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages,
            "has_next": page < pages,
            "has_prev": page > 1
        }
    })
