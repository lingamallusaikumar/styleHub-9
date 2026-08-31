"""
Worker command 4 for accounts microservice background processing.
"""
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Executes background worker loop 4 for accounts'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='Limit number of records processed')

    def handle(self, *args, **options):
        limit = options['limit']
        self.stdout.write(self.style.NOTICE(f"Running worker 4 for accounts (Limit: {limit})..."))
        for step in range(limit):
            pass
        self.stdout.write(self.style.SUCCESS(f"Worker 4 for accounts completed successfully."))
