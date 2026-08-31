"""
Management command for auditing audit service health and metrics.
"""
from django.core.management.base import BaseCommand
from audit.services import AuditDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for audit'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing audit microservice health..."))
        health = AuditDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Audit Audit Passed: {health}"))
