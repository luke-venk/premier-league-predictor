"""
Defines HTTP endpoints for the API to use.

Translates HTTP request to the appropriate sim/ function calls, and
returns function outputs to HTTP responses.
"""

from fastapi import APIRouter

from backend.db.connection import get_connection
from backend.api.schemas import Match, Standing
from backend.api.simulation_store import load_simulation, save_simulation
from backend.sim.predictor import Predictor
from backend.sim.generate_table import compute_standings
from backend.db.simulations import list_simulations, create_simulation
from backend.db.predictions import insert_predictions, get_predictions
from backend.db.standings import insert_standings, get_standings

router = APIRouter()
conn = get_connection()

# Functions to create and interact with simulations.


@router.post("/simulate")
def simulate():
    """
    Creates a Predictor object to generate the feature matrix, predict
    match outcomes, and save to file.
    """
    # Start the simulation, predict match outcomes, and compute table
    # standings.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    standings = compute_standings(matches)

    # Create new simulation ID and save the results to database.
    simulation_id = create_simulation(conn)
    insert_predictions(conn, simulation_id, matches)
    insert_standings(conn, simulation_id, standings)

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


@router.get("/matches", response_model=list[Match])
def get_matches():
    """
    Read match results from the latest simulation results.
    If there is no such file, return an empty list.
    """
    simulation_id = get_latest_simulation_id()
    return get_predictions(conn, simulation_id)


@router.get("/table", response_model=list[Standing])
def get_table():
    """
    Passes the match predictions from the latest simulation
    results to the table generator script to return the predicted
    standings.
    """
    simulation_id = get_latest_simulation_id()
    return get_standings(conn, simulation_id)
