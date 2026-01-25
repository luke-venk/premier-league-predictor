"""
Functions to handle formatting data between the database and the
frontend. This happens primarily since the database uses snake_case
and the frontend uses camelCase.
"""

from backend.api.schemas import ProbOut, MatchOut

def db_to_ui_matches(r: dict) -> MatchOut:
    """
    Converts PostgreSQL outputs into data format immediately
    acceptable by the frontend's UI.
    """
    return MatchOut(
        id=r["id"],
        date=r["match_date"],
        homeId=r["home_id"],
        awayId=r["away_id"],
        probabilities=ProbOut(
            homeWin=r["p_home"],
            draw=r["p_draw"],
            awayWin=r["p_away"]
        ),
        prediction=r["prediction"],
        actual=r["actual"]
    )