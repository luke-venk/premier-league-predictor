"""
Helper function to make creating jobs in PostgreSQL and enqueuing jobs
into the Redis queue more modular.
"""

import psycopg
from redis import Redis
from typing import Optional

from backend.config import REDIS_URL


def create_job_psql(conn: psycopg.Connection) -> int:
    """
    Creates a new job in the Postgres database and returns its job ID.
    """
    with conn.cursor() as cur:
        # The default values are id, job_status, and created_at.
        cur.execute("INSERT INTO job DEFAULT VALUES RETURNING id;")
        row = cur.fetchone()

    conn.commit()
    return row["id"]


def enqueue_job_hq(job_id: int) -> Optional[str]:
    """
    After creating a new job in the Postgres database, enqueue the
    new job ID into the Redis queue.

    Returns the error if the operation failed.
    """
    try:
        rd = Redis.from_url(REDIS_URL)
        # Left push the job ID into Redis, prepending to the queue.
        rd.lpush("queue", job_id)
    except Exception as e:
        return str(e)


def fail_job_psql(conn: psycopg.Connection, job_id: int, error: str) -> None:
    """
    If enqueueing a job failed, update its job status to failed.
    """
    with conn.cursor() as cur:
        cur.execute(
            """UPDATE job SET job_status = 'failed', finished_at = NOW(),
            error = %s WHERE id = %s;""",
            (error, job_id),
        )
    conn.commit()


def get_job_info(conn: psycopg.Connection, job_id: int) -> tuple[str, int]:
    """
    Given a specific job ID, returns the job's status and its corresponding
    simulation ID upon completion. This will be used to check if the job has
    finished and reached a terminal state, either successfully completing or
    failing, as well as to autopopulate the simulation select.
    """
    with conn.cursor() as cur:
        cur.execute("SELECT job_status FROM job WHERE id = %s;", (job_id,))
        row = cur.fetchone()
    
    sim_id = row["simulation_id"] if row["job_status"] in ["complete", "failed"] else "N/A"
    return row["job_status"], sim_id