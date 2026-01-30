# Ensure Make still runs despite directories or files having these names.
.PHONY: dev prod backend frontend db-up db-down install-backend install-frontend

#### DEFAULT MAKE COMMANDS #####
# dev (Postgres container, local frontend + backend)
dev: dev-up
	@$(MAKE) -j 2 backend-dev frontend-dev

# prod (frontend, backend, database all containerized)
prod:
	docker compose -f docker/prod/docker-compose.yml up -d --build


##### DEV #####
# Start the database, queue, and worker services before running the
# frontend and backend locally.
dev-up:
	docker compose -f docker/dev/docker-compose.yml up -d --build

# Stop the dev services.
dev-down:
	docker compose -f docker/dev/docker-compose.yml down

# Stop the dev services and delete the volume mount.
dev-reset:
	docker compose -f docker/dev/docker-compose.yml down -v

# Start the backend server locally (dev).
backend-dev:
	./backend/venv/bin/uvicorn backend.main:app --reload --port 8000

# Start the frontend server locally (dev).
frontend-dev:
	cd frontend && npm run dev -- --port 5173


##### PROD #####
# Stop the production services.
prod-down:
	docker compose -f docker/prod/docker-compose.yml down

# Stop the production services and delete the volume mount.
prod-reset:
	docker compose -f docker/prod/docker-compose.yml down -v

# Start the backend container (prod).
backend-prod:
	docker compose -f docker/prod/docker-compose.yml up -d backend

# Start the frontend container (prod).
frontend-prod:
	docker compose -f docker/prod/docker-compose.yml up -d frontend


##### INSTALLATION
# Install the backend for local development (dev).
install-backend:
	cd backend && python -m venv venv && ./venv/bin/pip install -r requirements.txt

# Install the frontend for local development (dev).
install-frontend:
	cd frontend && npm install
