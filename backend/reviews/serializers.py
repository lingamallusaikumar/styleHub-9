from rest_framework import serializers
from .models import Review, ReviewImage

class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image_url']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.full_name')
    user_avatar = serializers.ReadOnlyField(source='user.avatar_url')
    images = ReviewImageSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'user', 'user_name', 'user_avatar',
            'rating', 'title', 'comment', 'is_verified_buyer',
            'seller_response', 'helpful_count', 'images', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_buyer', 'helpful_count', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
