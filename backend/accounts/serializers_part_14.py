"""
Accounts Advanced REST Serializers & Data Transfer Objects (DTOs).
"""
from rest_framework import serializers

class AccountsExtendedDTOSerializerModule14(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    uuid = serializers.UUIDField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(default=True)
    status_code = serializers.CharField(max_length=50, default='ACTIVE')
    metadata = serializers.JSONField(default=dict)

    def validate_status_code(self, value):
        allowed = ['ACTIVE', 'PENDING', 'SUSPENDED', 'ARCHIVED', 'PROCESSING']
        if value not in allowed:
            raise serializers.ValidationError(f"Invalid status code. Allowed: {allowed}")
        return value

class AccountsAnalyticsSummarySerializer(serializers.Serializer):
    metric_name = serializers.CharField(max_length=100)
    metric_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    period = serializers.CharField(max_length=20)
    calculated_at = serializers.DateTimeField()
