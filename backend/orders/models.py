import uuid
from django.db import models
from django.conf import settings
from catalog.models import ProductVariant

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Payment'),
        ('PAID', 'Paid & Confirmed'),
        ('PROCESSING', 'Processing in Warehouse'),
        ('SHIPPED', 'Shipped / In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
        ('RETURN_REQUESTED', 'Return Requested'),
        ('RETURNED', 'Returned & Refunded'),
    )

    order_number = models.CharField(max_length=50, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    guest_email = models.EmailField(blank=True, default='')
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=15.00) # $15 flat express shipping
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    shipping_address_data = models.JSONField()
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"SH-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} (${self.total_amount})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    product_title = models.CharField(max_length=255)
    color_name = models.CharField(max_length=50)
    size = models.CharField(max_length=20)
    sku = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_title} ({self.size})"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=30, choices=Order.STATUS_CHOICES)
    notes = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Status {self.status} on {self.order.order_number}"


class ShipmentTracking(models.Model):
    CARRIER_CHOICES = (
        ('STYLEHUB_EXPRESS', 'StyleHub Express Courier'),
        ('FEDEX', 'FedEx International'),
        ('DHL', 'DHL Express Luxe'),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipment')
    carrier = models.CharField(max_length=50, choices=CARRIER_CHOICES, default='STYLEHUB_EXPRESS')
    tracking_number = models.CharField(max_length=100, unique=True)
    estimated_delivery = models.DateField(null=True, blank=True)
    current_location = models.CharField(max_length=150, default='StyleHub Fulfillment Hub, NY')
    delivery_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.carrier} - {self.tracking_number}"
