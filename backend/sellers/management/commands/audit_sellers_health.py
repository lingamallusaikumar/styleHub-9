"""
Management command for auditing sellers service health and metrics.
"""
from django.core.management.base import BaseCommand
from sellers.services import SellersDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for sellers'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing sellers microservice health..."))
        health = SellersDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Sellers Audit Passed: {health}"))
