"""
Custom Model Managers & QuerySet extensions for notifications microservice.
"""
from django.db import models

class NotificationsQuerySet(models.QuerySet):
    """Custom QuerySet methods for notifications."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class NotificationsManager(models.Manager):
    """Custom Manager for notifications models."""

    def get_queryset(self):
        return NotificationsQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
