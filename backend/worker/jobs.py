from backend.db.connection import get_connection
from backend.db.predictions import insert_predictions
from backend.db.simulations import create_simulation
from backend.db.standings import insert_standings
from backend.worker.predictor import Predictor
from backend.worker.generate_table import compute_standings
from backend.config import JobStatus


def _get_job_status(job_id: int) -> str:
    """
    Interacts with the PostgreSQL database to retrieve the status corresponding
    to the given job ID. Used for validating status updates.
    """
    # Connect to PostgreSQL database via psycopg connection.
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT job_status FROM job WHERE id = %s;", (job_id,))
            row = cur.fetchone()
    return row["job_status"]


def _update_job(job_id: int, status: str) -> None:
    """
    Interacts with the PostgreSQL database to update the status corresponding
    to the given job ID. Also updates the corresponding timestamp for the job
    with the current time.
    """
    # Connect to PostgreSQL database via psycopg connection.
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Update the job status and timestamp.
            # Note that the column name will differ based on the new job status.
            if status == JobStatus.RUNNING:
                cur.execute(
                    """UPDATE job
                    SET job_status = 'running', started_at = NOW()
                    WHERE id = %s""",
                    (job_id,),
                )
            elif status == JobStatus.COMPLETED:
                cur.execute(
                    """UPDATE job
                    SET job_status = 'completed', finished_at = NOW()
                    WHERE id = %s""",
                    (job_id,),
                )
            else:
                # If a job is being updated to something other than "running",
                # or "completed", it is not a valid job.
                return -1
        
        conn.commit()


def start_job(job_id: int) -> None:
    """
    Takes a previously 'queued' job and changes its status to 'running'.
    """
    # A job that was not previously in the 'queued' status cannot
    # now become 'running'.
    if _get_job_status(job_id) == JobStatus.QUEUED:
        return _update_job(job_id, JobStatus.RUNNING)


def do_job(job_id: int) -> None:
    """
    For a given job ID, reates a Predictor object to predict all match
    outcomes for the season, compute table standings, and then save the
    results to a new simulation in the database.
    """
    # Start the simulation, predict match outcomes, and compute table
    # standings. These are the heavy computations.
    predictor = Predictor()
    matches = predictor.predict_current_season()
    standings = compute_standings(matches)
    
    # Create new simulation ID and save the results to database.
    try:
        with get_connection() as conn:
            with conn.transaction():
                # Create a new simulation in the database.
                simulation_id = create_simulation(conn)
                # Insert the match predictions and table standings for this
                # simulation.
                insert_predictions(conn, simulation_id, matches)
                insert_standings(conn, simulation_id, standings)
                # Update the simulation ID for this job.
                with conn.cursor() as cur:
                    cur.execute("UPDATE job SET simulation_id = %s WHERE id = %s;", (simulation_id, job_id))
    except Exception as e:
        # If the job failed, update the error description for this job.
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE job SET error = %s WHERE id = %s;", (str(e), job_id))
            conn.commit()


def finish_job(job_id: int) -> None:
    """
    Takes a previously 'running' job and changes its status to 'completed'.
    """
    # A job that was not previously in the 'running' status cannot
    # now become 'completed'.
    if _get_job_status(job_id) == JobStatus.RUNNING:
        return _update_job(job_id, JobStatus.COMPLETED)
