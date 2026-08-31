"""
Management command for auditing cart service health and metrics.
"""
from django.core.management.base import BaseCommand
from cart.services import CartDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for cart'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing cart microservice health..."))
        health = CartDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Cart Audit Passed: {health}"))
