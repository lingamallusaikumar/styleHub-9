from django.db import models
from django.conf import settings

class SellerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='seller_profile'
    )
    store_name = models.CharField(max_length=150, unique=True)
    store_slug = models.SlugField(max_length=150, unique=True)
    bio = models.TextField(blank=True, default='')
    contact_email = models.EmailField()
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    banner_url = models.URLField(max_length=500, blank=True, null=True)
    is_approved = models.BooleanField(default=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00) # 10% platform fee
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.store_name} ({'Approved' if self.is_approved else 'Pending'})"
