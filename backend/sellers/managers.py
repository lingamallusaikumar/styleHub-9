"""
Custom Model Managers & QuerySet extensions for sellers microservice.
"""
from django.db import models

class SellersQuerySet(models.QuerySet):
    """Custom QuerySet methods for sellers."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class SellersManager(models.Manager):
    """Custom Manager for sellers models."""

    def get_queryset(self):
        return SellersQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
