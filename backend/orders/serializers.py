from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory, ShipmentTracking

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'variant', 'product_title', 'color_name',
            'size', 'sku', 'image_url', 'unit_price',
            'quantity', 'total_price'
        ]

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'notes', 'created_at']

class ShipmentTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentTracking
        fields = [
            'id', 'carrier', 'tracking_number', 'estimated_delivery',
            'current_location', 'delivery_notes', 'updated_at'
        ]

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    shipment = ShipmentTrackingSerializer(read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_email', 'guest_email',
            'status', 'subtotal', 'discount_amount', 'shipping_fee',
            'tax_amount', 'total_amount', 'shipping_address_data',
            'coupon_code', 'notes', 'items', 'status_history', 'shipment',
            'created_at', 'updated_at'
        ]
