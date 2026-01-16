"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""

from fastapi import APIRouter

from backend.api.schemas import SimulateResponse
from backend.sim.predictor import Predictor

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
@router.post("/simulate", response_model=SimulateResponse)
def simulate():
    return {"matches": sample_matches}


@router.get("/simulate", response_model=SimulateResponse)
def simulate():
    predictor = Predictor()
    # TODO: indicate on website that simulation is in progress
    matches = predictor.predict_current_season()
    
    return {"matches": matches}