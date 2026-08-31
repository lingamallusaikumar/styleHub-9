"""
Data validation & integrity rules for analytics microservice.
"""
from django.core.exceptions import ValidationError

def validate_analytics_payload(data: dict) -> bool:
    """Validate incoming JSON payload schema for analytics."""
    if not isinstance(data, dict):
        raise ValidationError("Payload must be a valid JSON dictionary.")
    return True

def validate_analytics_identifier(entity_id: int) -> bool:
    """Validate integer primary keys and entity identifiers."""
    if entity_id <= 0:
        raise ValidationError(f"Invalid analytics identifier: {entity_id}. Must be positive.")
    return True
