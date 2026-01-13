"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""
from fastapi import APIRouter
from api.schemas import SimulateResponse

router = APIRouter()

matches = [
  {
    "date": "01-01-2026",
    "homeId": "ARS",
    "awayId": "LIV",
    "prediction": "draw",
    "probabilities": {"homeWin": 0.25, "draw": 0.5, "awayWin": 0.25}
  },
  {
    "date": "02-01-2026",
    "homeId": "NEW",
    "awayId": "LEE",
    "prediction": "home_win",
    "probabilities": {"homeWin": 0.8, "draw": 0.1, "awayWin": 0.1}
  },
  {
    "date": "03-01-2026",
    "homeId": "WHU",
    "awayId": "NFO",
    "prediction": "away_win",
    "probabilities": {"homeWin": 0.4, "draw": 0.1, "awayWin": 0.5}
  }
]

# TODO: remove once add functionality for POST, and store in DB
@router.get("/simulate", response_model=SimulateResponse)
def simulate():
  return {
    "matches": matches
  }
  
@router.post("/simulate", response_model=SimulateResponse)
def simulate():
  return {
    "matches": matches
  }