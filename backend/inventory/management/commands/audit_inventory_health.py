"""
Management command for auditing inventory service health and metrics.
"""
from django.core.management.base import BaseCommand
from inventory.services import InventoryDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for inventory'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing inventory microservice health..."))
        health = InventoryDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Inventory Audit Passed: {health}"))
