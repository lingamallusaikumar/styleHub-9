"""
Custom Model Managers & QuerySet extensions for catalog microservice.
"""
from django.db import models

class CatalogQuerySet(models.QuerySet):
    """Custom QuerySet methods for catalog."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class CatalogManager(models.Manager):
    """Custom Manager for catalog models."""

    def get_queryset(self):
        return CatalogQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
