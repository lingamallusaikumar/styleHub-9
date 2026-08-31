"""
Custom Model Managers & QuerySet extensions for accounts microservice.
"""
from django.db import models

class AccountsQuerySet(models.QuerySet):
    """Custom QuerySet methods for accounts."""

    def active(self):
        return self.filter(is_active=True) if hasattr(self.model, 'is_active') else self

    def recent(self):
        return self.order_by('-created_at') if hasattr(self.model, 'created_at') else self


class AccountsManager(models.Manager):
    """Custom Manager for accounts models."""

    def get_queryset(self):
        return AccountsQuerySet(self.model, using=self._db)

    def get_active(self):
        return self.get_queryset().active()

    def get_recent(self):
        return self.get_queryset().recent()
