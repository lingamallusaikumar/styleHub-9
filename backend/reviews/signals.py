"""
Signal handlers & asynchronous lifecycle listeners for reviews microservice.
"""
import logging
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(post_save, sender='reviews.Reviews') if False else None
def handle_reviews_post_save(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    logger.info(f"Reviews entity {instance.id} was {action}.")

@receiver(post_delete, sender='reviews.Reviews') if False else None
def handle_reviews_post_delete(sender, instance, **kwargs):
    logger.warning(f"Reviews entity {instance.id} was deleted.")
