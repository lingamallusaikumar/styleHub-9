.PHONY: help install build run test clean docker-up docker-down

help:
	@echo "StyleHub Build System"
	@echo "make install    - Install backend & frontend dependencies"
	@echo "make run        - Run local development servers"
	@echo "make build      - Build production frontend assets"
	@echo "make test       - Run backend test suite"
	@echo "make docker-up  - Start Docker containers"

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

run:
	npm start

build:
	npm run build

test:
	cd backend && python manage.py test

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down
