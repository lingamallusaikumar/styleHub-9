# Multi-stage Docker build for StyleHub Enterprise Full-Stack Application

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Django Backend & Production Environment
FROM python:3.12-slim AS final
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python packages
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend application source
COPY backend/ /app/backend/

# Copy built frontend static assets into Django static directory
COPY --from=frontend-builder /app/frontend/dist /app/backend/static/frontend/

WORKDIR /app/backend

# Collect static files & prepare database
RUN python manage.py check || true

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
