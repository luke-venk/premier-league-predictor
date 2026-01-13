"""Entry point for backend."""

from fastapi import FastAPI, HTTPException
from api.routes import router as api_router

app = FastAPI(title="Premier League Predictor API")

# Include all API routes.
app.include_router(api_router, prefix="/api")
  
@app.get("/api/health")
def health():
  return {"status": "ok"}