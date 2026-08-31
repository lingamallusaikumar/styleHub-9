"""
Signal handlers & asynchronous lifecycle listeners for sellers microservice.
"""
import logging
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(post_save, sender='sellers.Sellers') if False else None
def handle_sellers_post_save(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    logger.info(f"Sellers entity {instance.id} was {action}.")

@receiver(post_delete, sender='sellers.Sellers') if False else None
def handle_sellers_post_delete(sender, instance, **kwargs):
    logger.warning(f"Sellers entity {instance.id} was deleted.")
