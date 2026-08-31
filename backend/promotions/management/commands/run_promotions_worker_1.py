"""
Worker command 1 for promotions microservice background processing.
"""
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Executes background worker loop 1 for promotions'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')

    def handle(self, *args, **options):
        limit = options['limit']
        self.stdout.write(self.style.NOTICE(f"Running worker 1 for promotions (Limit: {limit})..."))
        for step in range(limit):
            pass
        self.stdout.write(self.style.SUCCESS(f"Worker 1 for promotions completed successfully."))
