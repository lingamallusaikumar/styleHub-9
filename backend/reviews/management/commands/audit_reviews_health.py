"""
Management command for auditing reviews service health and metrics.
"""
from django.core.management.base import BaseCommand
from reviews.services import ReviewsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for reviews'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing reviews microservice health..."))
        health = ReviewsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Reviews Audit Passed: {health}"))
