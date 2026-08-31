"""
Management command for cart background tasks processing.
"""
from django.core.management.base import BaseCommand
from cart.services import CartDomainService

class Command(BaseCommand):
    help = 'Executes background maintenance tasks for cart microservice'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')
        parser.add_argument('--dry-run', action='store_true', help='Execute without writing to database')

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']
        self.stdout.write(self.style.NOTICE(f"Starting cart task processing (Limit: {limit}, Dry Run: {dry_run})..."))
        health = CartDomainService.get_service_health()
        metrics = CartDomainService.get_cart_metrics()
        self.stdout.write(self.style.SUCCESS(f"Finished cart task processing. Status: {health['status']}, Metrics: {metrics}"))
