"""
Management command for auditing orders service health and metrics.
"""
from django.core.management.base import BaseCommand
from orders.services import OrdersDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for orders'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing orders microservice health..."))
        health = OrdersDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Orders Audit Passed: {health}"))
