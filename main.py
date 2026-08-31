"""
StyleHub Application Entry Point Wrapper.
"""
import os
import sys

def main():
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    sys.path.insert(0, backend_dir)
    os.chdir(backend_dir)
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stylehub.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '127.0.0.1:8000'])

if __name__ == '__main__':
    main()
