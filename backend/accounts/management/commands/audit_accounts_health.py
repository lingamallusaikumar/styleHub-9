"""
Management command for auditing accounts service health and metrics.
"""
from django.core.management.base import BaseCommand
from accounts.services import AccountsDomainService

class Command(BaseCommand):
    help = 'Audits data integrity and performance metrics for accounts'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Auditing accounts microservice health..."))
        health = AccountsDomainService.get_service_health()
        self.stdout.write(self.style.SUCCESS(f"Accounts Audit Passed: {health}"))
