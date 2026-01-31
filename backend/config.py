"""
Configuration parameters for the project.
"""
from pathlib import Path
import os
from dotenv import load_dotenv
from enum import StrEnum

# Load environment variables from the .env file.
load_dotenv()

# Environment variable for the URL pointing to the PostgreSQL database.
DATABASE_URL = os.environ["DATABASE_URL"]

# Environment variable for the URL pointing to the Redis queue.
REDIS_URL = os.environ["REDIS_URL"]

# Enum to avoid mistyping job statuses.
class JobStatus(StrEnum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

# The path to the project root.
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# Path to the model.
MODEL_PATH = PROJECT_ROOT / "model" / "model.joblib"

# Path to the teams data.
TEAMS_PATH = PROJECT_ROOT / "backend" / "datasets" / "teams.json"

# Where to get the Football-Data.co.uk data from and where to store it.
FOOTBALL_DATA_URL = "https://football-data.co.uk/mmz4281/2526/E0.csv"
FOOTBALL_DATA_PATH = PROJECT_ROOT / "backend" / "datasets" / "footballdata.csv"

# The number of previous matches to be included to represent a team's current form.
N_MATCHES = 5