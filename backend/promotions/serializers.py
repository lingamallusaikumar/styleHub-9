from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'discount_type', 'discount_value',
            'min_spend', 'max_discount', 'usage_limit', 'used_count',
            'valid_from', 'valid_to', 'is_active'
        ]
