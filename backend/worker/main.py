from redis import Redis
import time

from backend.config import REDIS_URL
from backend.worker.jobs import start_job, do_job, finish_job


# Connect to Redis queue of jobs.
rd = Redis.from_url(REDIS_URL)


def consume_job(job_id: int) -> None:
    """
    The worker instance watches the queue and pulls jobs as they are enqueued.
    When a job is pulled, it should get the corresponding job entry in the
    Postgres database and update its status.
    """
    # Update job database to reflect the job is being worked on.
    start_job(job_id)

    # Perform the simulation and table computations for the current job.
    do_job(job_id)

    # Update job database to reflect the job has been completed.
    finish_job(job_id)


# Entry point for main: continuously pull jobs and work on them.
if __name__ == "__main__":
    while True:
        try:
            # Blocks until work exists, and once a job exists the worker
            # will pull the first job_id from the queue.
            _, raw = rd.brpop("queue")
            consume_job(job_id=int(raw))
        except Exception:
            time.sleep(1)
            continue
