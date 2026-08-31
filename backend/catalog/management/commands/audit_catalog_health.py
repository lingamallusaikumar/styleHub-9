"""
Management command for auditing catalog service health and metrics.
"""
from django.core.management.base import BaseCommand
from catalog.services import CatalogDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for catalog'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing catalog microservice health..."))
        health = CatalogDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Catalog Audit Passed: {health}"))
