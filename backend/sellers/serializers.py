from rest_framework import serializers
from .models import SellerProfile

class SellerProfileSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='user.full_name')

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user', 'owner_name', 'store_name', 'store_slug',
            'bio', 'contact_email', 'logo_url', 'banner_url',
            'is_approved', 'commission_rate', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'is_approved', 'created_at']
