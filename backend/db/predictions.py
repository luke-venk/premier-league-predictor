"""
Helper functions to insert predictions into simulations and query
match predictions given a simulation.
"""

import psycopg
from backend.api.schemas import Match


def insert_predictions(
    conn: psycopg.Connection, simulation_id: int, predictions: list[Match]
):
    """
    Given the season's predicted match outcomes for a given simulation,
    insert the predictions into the database.
    """
    with conn.cursor() as cur:
        for match in predictions:
            cur.execute(
                f"""
                        INSERT INTO match
                        (simulation_id, match_date, home_id, away_id, p_home, p_draw, p_away, prediction, actual)
                        VALUES
                        ({simulation_id}, '{match.match_date}', '{match.home_id}', '{match.away_id}',
                        {match.p_home}, {match.p_draw}, {match.p_away},
                        '{match.prediction}', '{match.actual}'
                        );
                        """
            )

    conn.commit()


def get_predictions(conn: psycopg.Connection, simulation_id: int) -> list[dict]:
    """
    Given a simulation ID, return all the match predictions associated
    with the simulation.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM match WHERE simulation_id = {simulation_id};")
        out = cur.fetchall()

    return out
