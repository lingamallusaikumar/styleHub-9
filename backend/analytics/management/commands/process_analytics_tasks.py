"""
Management command for analytics background tasks processing.
"""
from django.core.management.base import BaseCommand
from analytics.services import AnalyticsDomainService

class Command(BaseCommand):
    help = 'Executes background maintenance tasks for analytics microservice'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')
        parser.add_argument('--dry-run', action='store_true', help='Execute without writing to database')

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']
        self.stdout.write(self.style.NOTICE(f"Starting analytics task processing (Limit: {limit}, Dry Run: {dry_run})..."))
        health = AnalyticsDomainService.get_service_health()
        metrics = AnalyticsDomainService.get_analytics_metrics()
        self.stdout.write(self.style.SUCCESS(f"Finished analytics task processing. Status: {health['status']}, Metrics: {metrics}"))
