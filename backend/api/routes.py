"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""

from fastapi import APIRouter
from datetime import datetime
from zoneinfo import ZoneInfo
import json

from backend.api.schemas import MatchResponse, TableResponse
from backend.api.simulation_store import load_simulation, save_simulation
from backend.sim.predictor import Predictor
from backend.sim.generate_table import compute_standings

router = APIRouter()

@router.post("/simulate", response_model=MatchResponse)
def simulate():
    """
    Creates a Predictor object to generate the feature matrix, predict
    match outcomes, and save to file.
    """
    # Start the simulation and predict match outcomes.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    
    matches = [m.model_dump() for m in matches]
    
    # Also store the timestamp.
    # These should be isoformat for machine friendliness.
    timestamp = datetime.now(ZoneInfo("America/Chicago")).isoformat()
    
    payload =  {
        "timestamp": timestamp,
        "matches": matches
    }
    
    # Write to file.
    save_simulation(payload)
        
    return payload

@router.get("/matches", response_model=MatchResponse)
def get_matches():
    """
    Read match results from the latest simulation results.
    If there is no such file, return an empty list.
    """
    # Read simulation from file.
    payload = load_simulation()
    return payload

@router.get("/table", response_model=TableResponse)
def get_table():
    """
    Passes the match predictions from the latest simulation
    results to the table generator script to return the predicted
    standings.
    """
    # Read simulation results from file.
    payload = load_simulation()
    
    # Extract the list of matches.
    matches = payload["matches"]
    
    # Compute predicted standings.
    standings = compute_standings(matches)
    
    # TODO: maybe persist this as well instead of computing on render.
    return {"standings": standings}
