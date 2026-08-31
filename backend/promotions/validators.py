"""
Data validation & integrity rules for promotions microservice.
"""
from django.core.exceptions import ValidationError

def validate_promotions_payload(data: dict) -> bool:
    """Validate incoming JSON payload schema for promotions."""
    if not isinstance(data, dict):
        raise ValidationError("Payload must be a valid JSON dictionary.")
    return True

def validate_promotions_identifier(entity_id: int) -> bool:
    """Validate integer primary keys and entity identifiers."""
    if entity_id <= 0:
        raise ValidationError(f"Invalid promotions identifier: {entity_id}. Must be positive.")
    return True
