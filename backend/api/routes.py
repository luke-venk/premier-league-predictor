"""
Defines the HTTP endpoints for the API to use.
"""

from fastapi import APIRouter

from backend.db.connection import get_connection
from backend.api.schemas import Match, Standing
from backend.sim.predictor import Predictor
from backend.sim.generate_table import compute_standings
from backend.db.simulations import list_simulations, create_simulation, delete_simulations
from backend.db.predictions import insert_predictions, get_predictions
from backend.db.standings import insert_standings, get_standings

router = APIRouter()
# conn = get_connection()


@router.post("/simulate")
def simulate() -> dict:
    """
    Creates a Predictor object to predict all match outcomes for the
    season, compute table standings, and then save the results to
    a new simulation in the database.
    """
    # Start the simulation, predict match outcomes, and compute table
    # standings.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    standings = compute_standings(matches)

    # Create new simulation ID and save the results to database.
    try:
        with get_connection() as conn:
            with conn.transaction():        
                simulation_id = create_simulation(conn)
                insert_predictions(conn, simulation_id, matches)
                insert_standings(conn, simulation_id, standings)
        return {"ok": True, "simulation_id": simulation_id}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/simulations")
def get_simulations() -> list[dict]:
    """
    Returns a list of simulation objects. Each entry will be a dictionary
    containing simulation ID's and timestamps created.
    """
    with get_connection() as conn:
        simulations = list_simulations(conn)
    return simulations


@router.get("/simulations/latest")
def get_latest_simulation_id() -> int:
    """
    Returns the ID of the latest ran simulation. This will be used
    as a default option if the user does not specify a specific
    simulation.
    
    Returns -1 if there are no simulations in the database.
    """
    with get_connection() as conn:
        simulations = list_simulations(conn)
    return simulations[-1]["id"] if simulations else -1

@router.delete("/simulations")
def clear_data() -> dict:
    """
    Deletes all data in the simulation, match, and standing tables.
    """
    try:
        with get_connection() as conn:
            delete_simulations(conn)
            conn.commit()
        return {"ok": True}
    except:
        return {"ok": False}


@router.get("/matches", response_model=list[Match])
def get_matches(simulation: int = 0):
    """
    Read match results from a specified simulation.
    """
    simulation_id = simulation if simulation != 0 else get_latest_simulation_id()
    
    # If simulation ID is -1, there are no entries in the database.
    with get_connection() as conn:
        return get_predictions(conn, simulation_id) if simulation_id != -1 else []


@router.get("/table", response_model=list[Standing])
def get_table(simulation: int=0):
    """
    Read computed standings from a specified simulation.
    """
    simulation_id = simulation if simulation != 0 else get_latest_simulation_id()
    # If simulation ID is -1, there are no entries in the database.
    with get_connection() as conn:
        return get_standings(conn, simulation_id) if simulation_id != -1 else []
