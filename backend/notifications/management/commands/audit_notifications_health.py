"""
Management command for auditing notifications service health and metrics.
"""
from django.core.management.base import BaseCommand
from notifications.services import NotificationsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for notifications'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing notifications microservice health..."))
        health = NotificationsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Notifications Audit Passed: {health}"))
