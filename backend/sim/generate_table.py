from backend.api.schemas import Match, Standing
from backend.api.simulation_store import get_teams
from backend.config import TEAMS_PATH


def compute_standings(matches: list[Match]) -> list[Standing]:
    # Generate empty standings for each team before going through matches.
    teams = get_teams()
    standings = []
    for i in range(len(teams)):
        standings.append(
            Standing(
                position=(i + 1),
                teamId=teams[i],
                played=0,
                won=0,
                drew=0,
                lost=0,
                points=0,
            )
        )
    
    # TODO: add actual logic.
    return standings
