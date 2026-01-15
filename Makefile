# Ensure Make still runs despite directories or files having these names.
.PHONY: backend frontend

### RUNTIME
# Default make command.
dev:
	@$(MAKE) -j 2 backend frontend

# Start the backend server.
backend:
	./backend/venv/bin/uvicorn backend.main:app --reload --port 8000

# Start the frontend server.
frontend:
	cd frontend && npm run dev -- --port 5173

### INSTALLATION
install-backend:
	cd backend && python -m venv venv && ./venv/bin/activate.fish && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install
