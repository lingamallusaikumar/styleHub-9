from rest_framework import serializers
from .models import Warehouse, StockMovement

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code', 'location', 'is_primary']

class StockMovementSerializer(serializers.ModelSerializer):
    sku = serializers.ReadOnlyField(source='variant.sku')
    product_title = serializers.ReadOnlyField(source='variant.product.title')

    class Meta:
        model = StockMovement
        fields = ['id', 'variant', 'sku', 'product_title', 'warehouse', 'quantity', 'movement_type', 'notes', 'timestamp']
