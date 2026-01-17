import json
from backend.config import SIM_PATH, TEAMS_PATH
from typing import Any


def load_simulation() -> dict[str, Any]:
    """
    Read the latest simulation results from file.
    """
    try:
        with open(SIM_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"timestamp": "", "matches": []}

def save_simulation(payload: dict[str, Any]) -> None:
    """
    Write the latest simulation results to file.
    """
    with open(SIM_PATH, "w") as f:
        json.dump(payload, f, indent=2)
        
def get_teams() -> list[str]:
    """
    Loads data from teams.json and returns a list of the 20 current
    Premier League team acronyms.
    """
    try:
        with open(TEAMS_PATH, "r") as f:
            teams = json.load(f)
        return list(teams.keys())
    except FileNotFoundError:
        return []