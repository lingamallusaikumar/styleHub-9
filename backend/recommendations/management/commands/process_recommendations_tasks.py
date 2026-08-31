"""
Management command for recommendations background tasks processing.
"""
from django.core.management.base import BaseCommand
from recommendations.services import RecommendationsDomainService

class Command(BaseCommand):
    help = 'Executes background maintenance tasks for recommendations microservice'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')
        parser.add_argument('--dry-run', action='store_true', help='Execute without writing to database')

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']
        self.stdout.write(self.style.NOTICE(f"Starting recommendations task processing (Limit: {limit}, Dry Run: {dry_run})..."))
        health = RecommendationsDomainService.get_service_health()
        metrics = RecommendationsDomainService.get_recommendations_metrics()
        self.stdout.write(self.style.SUCCESS(f"Finished recommendations task processing. Status: {health['status']}, Metrics: {metrics}"))
