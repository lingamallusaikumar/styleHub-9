"""
Data validation & integrity rules for cart microservice.
"""
from django.core.exceptions import ValidationError

def validate_cart_payload(data: dict) -> bool:
    """Validate incoming JSON payload schema for cart."""
    if not isinstance(data, dict):
        raise ValidationError("Payload must be a valid JSON dictionary.")
    return True

def validate_cart_identifier(entity_id: int) -> bool:
    """Validate integer primary keys and entity identifiers."""
    if entity_id <= 0:
        raise ValidationError(f"Invalid cart identifier: {entity_id}. Must be positive.")
    return True
