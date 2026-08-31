import uuid
from django.db import models
from orders.models import Order

class PaymentTransaction(models.Model):
    METHOD_CHOICES = (
        ('CREDIT_CARD', 'Credit / Debit Card'),
        ('UPI', 'UPI Instant Pay'),
        ('NET_BANKING', 'Net Banking'),
        ('APPLE_PAY', 'Apple Pay'),
        ('WALLET', 'StyleHub Wallet'),
        ('PAY_LATER', 'Buy Now Pay Later'),
    )

    STATUS_CHOICES = (
        ('INITIATED', 'Initiated'),
        ('SUCCESS', 'Payment Successful'),
        ('FAILED', 'Payment Failed'),
        ('REFUNDED', 'Fully Refunded'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    transaction_id = models.CharField(max_length=100, unique=True, editable=False)
    payment_method = models.CharField(max_length=30, choices=METHOD_CHOICES, default='CREDIT_CARD')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='INITIATED')
    provider_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.transaction_id} (${self.amount}) - {self.status}"


class RefundTransaction(models.Model):
    payment = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name='refunds')
    refund_id = models.CharField(max_length=100, unique=True, editable=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField(blank=True, default='Customer requested return.')
    status = models.CharField(max_length=20, default='SUCCESS')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.refund_id:
            self.refund_id = f"RFD-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Refund {self.refund_id} (${self.amount})"
