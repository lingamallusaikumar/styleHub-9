"""
Data validation & integrity rules for payments microservice.
"""
from django.core.exceptions import ValidationError

def validate_payments_payload(data: dict) -> bool:
    """Validate incoming JSON payload schema for payments."""
    if not isinstance(data, dict):
        raise ValidationError("Payload must be a valid JSON dictionary.")
    return True

def validate_payments_identifier(entity_id: int) -> bool:
    """Validate integer primary keys and entity identifiers."""
    if entity_id <= 0:
        raise ValidationError(f"Invalid payments identifier: {entity_id}. Must be positive.")
    return True
