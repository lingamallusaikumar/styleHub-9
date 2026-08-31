"""
Signal handlers & asynchronous lifecycle listeners for recommendations microservice.
"""
import logging
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(post_save, sender='recommendations.Recommendations') if False else None
def handle_recommendations_post_save(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    logger.info(f"Recommendations entity {instance.id} was {action}.")

@receiver(post_delete, sender='recommendations.Recommendations') if False else None
def handle_recommendations_post_delete(sender, instance, **kwargs):
    logger.warning(f"Recommendations entity {instance.id} was deleted.")
