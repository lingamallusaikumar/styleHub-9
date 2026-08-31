"""
Management command for orders background tasks processing.
"""
from django.core.management.base import BaseCommand
from orders.services import OrdersDomainService

class Command(BaseCommand):
    help = 'Executes background maintenance tasks for orders microservice'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')
        parser.add_argument('--dry-run', action='store_true', help='Execute without writing to database')

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']
        self.stdout.write(self.style.NOTICE(f"Starting orders task processing (Limit: {limit}, Dry Run: {dry_run})..."))
        health = OrdersDomainService.get_service_health()
        metrics = OrdersDomainService.get_orders_metrics()
        self.stdout.write(self.style.SUCCESS(f"Finished orders task processing. Status: {health['status']}, Metrics: {metrics}"))
