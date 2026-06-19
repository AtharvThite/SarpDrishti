def apply_translation(doc, lang):
    """
    Overwrites the base English fields with localized fields if `lang` is provided
    and exists within the doc['translations'] object.
    Returns the modified doc (removes the translations object for clean API response).
    """
    if not doc:
        return doc
        
    if lang and lang != 'en' and 'translations' in doc:
        t_data = doc['translations'].get(lang)
        if t_data:
            for key, value in t_data.items():
                doc[key] = value
                
    # Always remove the heavy translations object before returning to client
    if 'translations' in doc:
        del doc['translations']
        
    return doc
