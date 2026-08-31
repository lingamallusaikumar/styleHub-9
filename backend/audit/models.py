from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('LOGIN', 'User Login'),
        ('REGISTER', 'User Registration'),
        ('CREATE', 'Resource Created'),
        ('UPDATE', 'Resource Updated'),
        ('DELETE', 'Resource Deleted'),
        ('CHECKOUT', 'Order Checkout'),
        ('PAYMENT', 'Payment Attempt'),
        ('REFUND', 'Refund Requested'),
        ('ADMIN_ACTION', 'Admin Override'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, default='UPDATE')
    method = models.CharField(max_length=10, default='POST')
    path = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    status_code = models.IntegerField(default=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        user_str = self.user.email if self.user else 'Anonymous'
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {user_str} - {self.action} ({self.path})"
