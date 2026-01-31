"""
Defines the HTTP endpoints for the API to use.
"""

from fastapi import APIRouter

from backend.api.schemas import Match, Standing
from backend.db.connection import get_connection
from backend.db.simulations import list_simulations, clear_database
from backend.db.predictions import get_predictions
from backend.db.standings import get_standings
from backend.db.jobs import create_job_psql, enqueue_job_hq, fail_job_psql, get_job_info

router = APIRouter()


@router.post("/simulate")
def run_simulation() -> dict:
    """
    Create a job in the job database in Postgres and enqueue a job
    in the Redis queue for workers to perform simulations and compute
    table standings.
    
    Returns a success indicator as well as the new job ID is successful.
    """
    # Create a job in the Postgres database.
    with get_connection() as conn:
        job_id = create_job_psql(conn)
        
    # Enqueue the job ID into the queue.
    error = enqueue_job_hq(job_id)
    
    # If the enqueuing failed, return that the POST failed.
    if error:
        with get_connection() as conn:
            fail_job_psql(conn, job_id, error)
        return {"ok": False}
    else:
        return {"ok": True, "jobId": job_id}


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
def delete_simulations() -> dict:
    """
    Deletes all data in the simulation, match, and standing tables.
    """
    try:
        with get_connection() as conn:
            clear_database(conn)
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
def get_table(simulation: int = 0):
    """
    Read computed standings from a specified simulation.
    """
    simulation_id = simulation if simulation != 0 else get_latest_simulation_id()
    # If simulation ID is -1, there are no entries in the database.
    with get_connection() as conn:
        return get_standings(conn, simulation_id) if simulation_id != -1 else []

@router.get("/jobs", response_model=dict)
def get_job(job_id: int):
    """
    Returns information related to the job corresponding with the provied job ID.
    This will be used for polling the status of a job, in order to update
    the simulation store upon completion.
    """
    try:
        with get_connection() as conn:
            job_status, sim_id = get_job_info(conn, job_id)
        return {"ok": True, "jobStatus": job_status, "simulationId": sim_id}
    except:
        return {"ok": False}