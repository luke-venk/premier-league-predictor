"""
Configuration parameters for the project.
"""
from pathlib import Path

# The path to the project root.
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# Path to the latest simulation results.
SIM_PATH = PROJECT_ROOT / "backend" / "data" / "simulation_results.json"

# Path to the model.
MODEL_PATH = PROJECT_ROOT / "model" / "model.joblib"

# Where to get the Football-Data.co.uk data from and where to store it.
FOOTBALL_DATA_URL = "https://football-data.co.uk/mmz4281/2526/E0.csv"
FOOTBALL_DATA_PATH = PROJECT_ROOT / "backend" / "data" / "footballdata.csv"

# The number of previous matches to be included to represent a team's current form.
N_MATCHES = 5