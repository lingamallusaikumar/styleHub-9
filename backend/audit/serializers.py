from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_full_name = serializers.ReadOnlyField(source='user.full_name')

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'user_full_name',
            'action', 'method', 'path', 'ip_address',
            'status_code', 'timestamp', 'details'
        ]
