from rest_framework import generics, permissions
from .models import Warehouse, StockMovement
from .serializers import WarehouseSerializer, StockMovementSerializer

class WarehouseListView(generics.ListCreateAPIView):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.IsAdminUser]


class StockMovementListView(generics.ListCreateAPIView):
    queryset = StockMovement.objects.select_related('variant', 'variant__product', 'warehouse').all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        movement = serializer.save()
        # Adjust stock_quantity on the variant automatically
        variant = movement.variant
        variant.stock_quantity += movement.quantity
        if variant.stock_quantity < 0:
            variant.stock_quantity = 0
        variant.save()
