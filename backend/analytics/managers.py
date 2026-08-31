"""
Custom Model Managers & QuerySet extensions for analytics microservice.
"""
from django.db import models

class AnalyticsQuerySet(models.QuerySet):
    """Custom QuerySet methods for analytics."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class AnalyticsManager(models.Manager):
    """Custom Manager for analytics models."""

    def get_queryset(self):
        return AnalyticsQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
