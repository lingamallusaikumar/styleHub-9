from rest_framework import serializers
from .models import Cart, CartItem
from catalog.serializers import ProductVariantSerializer, ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    product_details = ProductListSerializer(source='variant.product', read_only=True)
    unit_price = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'variant', 'variant_details', 'product_details',
            'quantity', 'unit_price', 'total_price', 'created_at'
        ]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'item_count', 'subtotal', 'updated_at']
