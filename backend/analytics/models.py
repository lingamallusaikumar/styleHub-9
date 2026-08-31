from django.db import models

class DailyAnalyticsSnapshot(models.Model):
    date = models.DateField(unique=True)
    gmv = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    order_count = models.PositiveIntegerField(default=0)
    customer_count = models.PositiveIntegerField(default=0)
    avg_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Analytics {self.date}: GMV ${self.gmv}"
