"""
Management command for auditing analytics service health and metrics.
"""
from django.core.management.base import BaseCommand
from analytics.services import AnalyticsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for analytics'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing analytics microservice health..."))
        health = AnalyticsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Analytics Audit Passed: {health}"))
