"""
Defines the HTTP endpoints for the API to use.
"""

from fastapi import APIRouter

from backend.db.connection import get_connection
from backend.api.schemas import Match, Standing
from backend.sim.predictor import Predictor
from backend.sim.generate_table import compute_standings
from backend.db.simulations import list_simulations, create_simulation
from backend.db.predictions import insert_predictions, get_predictions
from backend.db.standings import insert_standings, get_standings

router = APIRouter()
conn = get_connection()

# Functions to create and interact with simulations.


@router.post("/simulate")
def simulate() -> None:
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


@router.get("/simulations")
def get_simulations() -> list[dict]:
    """
    Returns a list of simulation objects. Each entry will be a dictionary
    containing simulation ID's and timestamps created.
    """
    simulations = list_simulations(conn)
    return simulations


def get_latest_simulation_id() -> int:
    """
    Returns the ID of the latest ran simulation. This will be used
    as a default option if the user does not specify a specific
    simulation.
    """
    simulations = list_simulations(conn)
    return simulations[-1]["id"]


@router.get("/matches", response_model=list[Match])
def get_matches(simulation: int = 0):
    """
    Read match results from a specified simulation.
    """
    simulation_id = simulation if simulation != 0 else get_latest_simulation_id()
    return get_predictions(conn, simulation_id)


@router.get("/table", response_model=list[Standing])
def get_table(simulation: int=0):
    """
    Read computed standings from a specified simulation.
    """
    simulation_id = simulation if simulation != 0 else get_latest_simulation_id()
    return get_standings(conn, simulation_id)
