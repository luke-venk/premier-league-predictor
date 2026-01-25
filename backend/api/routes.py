"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""

from fastapi import APIRouter

from backend.db.connection import get_connection
from backend.api.schemas import Match, MatchOut, TableResponse
from backend.api.simulation_store import load_simulation, save_simulation
from backend.api.interface import db_to_ui_matches
from backend.sim.predictor import Predictor
from backend.sim.generate_table import compute_standings
from backend.db.simulations import list_simulations, create_simulation
from backend.db.predictions import insert_predictions, get_predictions

router = APIRouter()
conn = get_connection()

# Functions to create and interact with simulations.

@router.post("/simulate")
def simulate():
    """
    Creates a Predictor object to generate the feature matrix, predict
    match outcomes, and save to file.
    """
    # Start the simulation and predict match outcomes.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    
    # Create new simulation ID and save match predictions to database.
    simulation_id = create_simulation(conn)
    insert_predictions(conn, simulation_id, matches)
    
    # TODO: remove.
    # Write to JSON file.
    # Also store the timestamp in isoformat for machine friendliness.
    # timestamp = datetime.now(ZoneInfo("America/Chicago")).isoformat()
    # payload =  {
    #     "timestamp": timestamp,
    #     "matches": [m.model_dump(by_alias=True) for m in matches]
    # }
    # save_simulation(payload)
        
    # return payload

@router.get("/simulations")
def get_simulations() -> list[dict]:
    """
    Returns a list of simulation objects. Each entry will be a dictionary
    containing simulation ID's and timestamps created.
    """
    simulations = list_simulations(conn)
    return simulations

@router.get("/get_latest_simulation_id")
def get_latest_simulation_id():
    # TODO: remove: Just for testing
    simulations = list_simulations(conn)
    return simulations[-1]["id"]
    
# Functions to get the matches associated with a specific simulation.

@router.get("/matches", response_model=list[MatchOut])
def get_matches():
    """
    Read match results from the latest simulation results.
    If there is no such file, return an empty list.
    """
    simulation_id = get_latest_simulation_id()
    rows = get_predictions(conn, simulation_id)
    return [db_to_ui_matches(r) for r in rows]
        

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
    
    # Parse into Pydantic Match.
    matches = [Match.model_validate(m) for m in matches]
    
    # Compute predicted standings.
    standings = compute_standings(matches)
    
    # TODO: maybe persist this as well instead of computing on render.
    return {"standings": standings}
