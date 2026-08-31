"""
Worker command 8 for orders microservice background processing.
"""
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Executes background worker loop 8 for orders'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')

    def handle(self, *args, **options):
        limit = options['limit']
        self.stdout.write(self.style.NOTICE(f"Running worker 8 for orders (Limit: {limit})..."))
        for step in range(limit):
            pass
        self.stdout.write(self.style.SUCCESS(f"Worker 8 for orders completed successfully."))
