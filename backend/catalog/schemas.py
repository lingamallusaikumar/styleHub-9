"""
OpenAPI & DRF Schema Definitions for catalog microservice.
"""
from rest_framework import serializers

class CatalogSchemaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(max_length=50, default='ACTIVE')
    created_at = serializers.DateTimeField(read_only=True)
    metadata = serializers.DictField(default=dict)
