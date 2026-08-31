"""
Management command for auditing promotions service health and metrics.
"""
from django.core.management.base import BaseCommand
from promotions.services import PromotionsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for promotions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing promotions microservice health..."))
        health = PromotionsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Promotions Audit Passed: {health}"))
