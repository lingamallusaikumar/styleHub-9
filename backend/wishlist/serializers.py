from rest_framework import serializers
from .models import Wishlist, WishlistItem
from catalog.serializers import ProductListSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_details', 'added_at']

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'name', 'is_default', 'items', 'item_count', 'created_at']

    def get_item_count(self, obj):
        return obj.items.count()
