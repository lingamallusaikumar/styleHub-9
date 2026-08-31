from django.db import models
from django.conf import settings
from catalog.models import ProductVariant

class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=255)
    is_primary = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ('RESTOCK', 'Initial Stock / Restock'),
        ('ORDER_RESERVATION', 'Order Reservation'),
        ('ORDER_FULFILLED', 'Order Fulfilled / Dispatched'),
        ('RETURN_RESTOCK', 'Return Item Restocked'),
        ('ADJUSTMENT', 'Manual Adjustment'),
    )

    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='stock_movements')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='stock_movements', null=True, blank=True)
    quantity = models.IntegerField() # Positive for add, negative for deduct
    movement_type = models.CharField(max_length=30, choices=MOVEMENT_TYPES)
    notes = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.variant.sku}: {self.quantity} ({self.movement_type})"


class InventoryLock(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='inventory_locks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=100, blank=True, default='')
    quantity = models.PositiveIntegerField(default=1)
    locked_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Lock on {self.variant.sku} x {self.quantity}"
