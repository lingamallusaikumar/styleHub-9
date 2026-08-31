"""
Custom Model Managers & QuerySet extensions for orders microservice.
"""
from django.db import models

class OrdersQuerySet(models.QuerySet):
    """Custom QuerySet methods for orders."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class OrdersManager(models.Manager):
    """Custom Manager for orders models."""

    def get_queryset(self):
        return OrdersQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
