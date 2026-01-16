"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""

from fastapi import APIRouter
from datetime import datetime
from zoneinfo import ZoneInfo
import json

from backend.api.schemas import SimulationResponse
from backend.sim.predictor import Predictor
from backend.config import SIM_PATH

router = APIRouter()

sample_matches = [
    {
        "date": "01-01-2026",
        "homeId": "ARS",
        "awayId": "LIV",
        "prediction": "draw",
        "probabilities": {"homeWin": 0.25, "draw": 0.5, "awayWin": 0.25},
    },
    {
        "date": "02-01-2026",
        "homeId": "NEW",
        "awayId": "LEE",
        "prediction": "home_win",
        "probabilities": {"homeWin": 0.8, "draw": 0.1, "awayWin": 0.1},
    },
    {
        "date": "03-01-2026",
        "homeId": "WHU",
        "awayId": "NFO",
        "prediction": "away_win",
        "probabilities": {"homeWin": 0.4, "draw": 0.1, "awayWin": 0.5},
    }
]


# TODO: remove once functionality for POST is added, and stored in the DB.
@router.post("/simulate", response_model=SimulationResponse)
def simulate():
    # Start the simulation and predict match outcomes.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    
    # Convert from pydantic models to JSON serializable
    matches = [m.model_dump() for m in matches]
    
    # Also store the timestamp.
    # These should be isoformat for machine friendliness.
    timestamp = datetime.now(ZoneInfo("America/Chicago")).isoformat()
    
    payload =  {
        "timestamp": timestamp,
        "matches": matches
    }
    
    # Write to file.
    with open(SIM_PATH, 'w') as f:
        json.dump(payload, f)
        
    return payload

@router.get("/matches", response_model=SimulationResponse)
def get_matches():
    """
    Read match results from the latest simulation results.
    If there is no such file, return an empty list.
    """
    try:
        with open(SIM_PATH, 'r') as f:
            payload = json.load(f)
        return payload
    except FileNotFoundError:
        return {
            "timestamp": "",
            "matches": []
        }