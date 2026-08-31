from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    DISCOUNT_TYPES = (
        ('PERCENTAGE', 'Percentage Discount (%)'),
        ('FIXED_AMOUNT', 'Fixed Amount Discount ($)'),
    )

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default='PERCENTAGE')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2) # e.g. 20 for 20% or 20 for $20
    min_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=500)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_valid_now(self):
        now = timezone.now()
        if not self.is_active:
            return False, "Coupon is disabled."
        if self.used_count >= self.usage_limit:
            return False, "Coupon usage limit reached."
        if self.valid_from and now < self.valid_from:
            return False, "Coupon is not active yet."
        if self.valid_to and now > self.valid_to:
            return False, "Coupon has expired."
        return True, "Valid"

    def calculate_discount(self, subtotal):
        if subtotal < self.min_spend:
            return 0.0, f"Minimum spend of ${self.min_spend} required."
        
        if self.discount_type == 'PERCENTAGE':
            discount = (subtotal * self.discount_value) / 100
            if self.max_discount and discount > self.max_discount:
                discount = self.max_discount
        else:
            discount = self.discount_value
            if discount > subtotal:
                discount = subtotal

        return round(float(discount), 2), "Discount applied successfully."

    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'PERCENTAGE' else '$'})"
