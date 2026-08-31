@echo off
start "StyleHub Backend" /min cmd /k "cd /d c:\Users\saiku\OneDrive\Desktop\ELEVATEIQ\stylehub\backend && python manage.py runserver 127.0.0.1:8000"
start "StyleHub Frontend" /min cmd /k "cd /d c:\Users\saiku\OneDrive\Desktop\ELEVATEIQ\stylehub\frontend && npm run dev"
