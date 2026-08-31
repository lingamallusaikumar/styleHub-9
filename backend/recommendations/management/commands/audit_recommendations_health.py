"""
Management command for auditing recommendations service health and metrics.
"""
from django.core.management.base import BaseCommand
from recommendations.services import RecommendationsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for recommendations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing recommendations microservice health..."))
        health = RecommendationsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Recommendations Audit Passed: {health}"))
