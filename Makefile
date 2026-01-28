# Ensure Make still runs despite directories or files having these names.
.PHONY: dev backend frontend db-up db-down install-backend install-frontend

# Default make command: dev (Postgres container, local frontend + backend)
dev: db-up
	@$(MAKE) -j 2 backend frontend

# Start the database service.
db-up:
	docker compose -f docker/dev/docker-compose.yml up -d database

# Stop the database service.
db-down:
	docker compose -f docker/dev/docker-compose.yml down

# Stop the database and delete the volume mount.
db-reset:
	docker compose -f docker/dev/docker-compose.yml down -v

# Start the backend server.
backend:
	./backend/venv/bin/uvicorn backend.main:app --reload --port 8000

# Start the frontend server.
frontend:
	cd frontend && npm run dev -- --port 5173

### INSTALLATION
install-backend:
	cd backend && python -m venv venv && ./venv/bin/pip install -r requirements.txt

install-frontend:
	cd frontend && npm install
