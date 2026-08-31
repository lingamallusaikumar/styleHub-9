# StyleHub Luxury Fashion E-Commerce Platform

> High-performance modular e-commerce backend service built with Django 5 REST Framework & React 19 Vite.

---

## Architecture Overview

StyleHub is an enterprise fashion e-commerce ecosystem featuring 14 domain-driven microservices, real-time inventory management, an interactive REST API portal, AI recommendations, vendor ERP analytics, and multi-currency checkout.

```text
stylehub/
├── backend/                # Django REST API Microservices (Python 3.12/3.14)
│   ├── catalog/            # Products, Categories, Brands, Variants, Specs
│   ├── orders/             # Order Processing, Checkout State Machine, Tracking
│   ├── inventory/          # Multi-Warehouse Stock, SKU Management
│   ├── sellers/            # Vendor Profiles, Commission Ledgers, Payouts
│   ├── payments/           # Payment Gateway Adapters, Invoicing, Tax Engine
│   ├── promotions/         # Loyalty Rewards, Coupon Validation, Flash Sales
│   ├── reviews/            # Verified Product Ratings, Sentiment Analysis
│   ├── recommendations/    # Vector Similarity Matching, Style Pairing Engine
│   ├── accounts/           # User Authentication, JWT Tokens, Profiles
│   ├── analytics/          # Sales Reporting, Executive Dashboards
│   ├── audit/              # System Audit Logging, Security Access Trails
│   ├── notifications/      # Customer Alert Queue, Email Dispatcher
│   ├── cart/               # Persistent Session Cart Engine
│   └── stylehub/           # Core Settings, Middleware, Routing, API Portal
└── frontend/               # React 19 + TypeScript + Vite Single Page Application
    ├── src/
    │   ├── components/     # UI Components, Modals, Drawers, Portals
    │   ├── services/       # API Services, Client Wrappers, Multi-Currency
    │   ├── types/          # TypeScript Domain Interfaces
    │   └── data/           # Mock Seeding Data & Constants
    └── vite.config.ts
```

---

## Requirements & Prerequisites

- **Python**: 3.10+ (Recommended Python 3.12 / 3.14)
- **Node.js**: 18.0+ (Recommended Node.js 20+)
- **Docker**: 24.0+ & Docker Compose (Optional for containerized run)

---

## Quick Start & Installation

### Option 1: Native Local Development

#### 1. Backend Setup (Django)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed catalog & test data
python manage.py seed_catalog

# Start Django Development Server
python manage.py runserver 127.0.0.1:8000
```

#### 2. Frontend Setup (React Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```

The application will be accessible at:
- **Frontend App**: [http://localhost:5173/](http://localhost:5173/)
- **Interactive API Portal**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- **Django Admin**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

### Option 2: Docker Containerized Setup

```bash
# Build and launch all services in detached mode
docker-compose up --build -d

# View service logs
docker-compose logs -f
```

---

## Build System & Commands

| Command | Purpose |
| :--- | :--- |
| `npm start` | Launches Vite frontend development server |
| `npm run build` | Compiles TypeScript & bundles Vite production build |
| `python manage.py check` | Executes Django system configuration audit |
| `python manage.py test` | Runs backend unit & API endpoint tests |
| `make build` | Builds both frontend assets and Docker containers |

---

## API Endpoints Directory

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/` | `GET` | Public | Interactive API Portal & Endpoint Explorer |
| `/api/catalog/products/` | `GET` | Public | List products with search, pagination, and multi-filters |
| `/api/catalog/categories/` | `GET` | Public | Retrieve fashion taxonomy hierarchy tree |
| `/api/catalog/brands/` | `GET` | Public | List designer brands & seller profiles |
| `/api/cart/` | `GET/POST` | Public | Shopping cart item state management |
| `/api/orders/` | `GET/POST` | Protected | Order placement, state machine, tracking |
| `/api/inventory/` | `GET` | Protected | Warehouse stock levels & SKU tracking |
| `/api/sellers/` | `GET` | Protected | Vendor store profiles & commission ledgers |
| `/api/analytics/` | `GET` | Protected | Revenue reports & executive analytics |
| `/api/auth/token/` | `POST` | Public | Obtain JWT Access and Refresh tokens |

---

## Testing & Quality Assurance

```bash
# Backend Tests
cd backend
python manage.py test

# Frontend Build Audit
cd frontend
npm run build
```

---

## License

Proprietary (UNLICENSED). All rights reserved. StyleHub Luxury E-Commerce Framework © 2026.
