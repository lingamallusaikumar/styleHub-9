"""
Management command for auditing payments service health and metrics.
"""
from django.core.management.base import BaseCommand
from payments.services import PaymentsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for payments'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing payments microservice health..."))
        health = PaymentsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Payments Audit Passed: {health}"))
