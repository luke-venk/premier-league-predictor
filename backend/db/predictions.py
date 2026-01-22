"""
Helper functions to insert predictions into simulations and query
match predictions given a simulation.
"""

import psycopg
from backend.api.schemas import Match


def insert_predictions(
    conn: psycopg.Connection, simulation_id: int, predictions: list[Match]
) -> int:
    """
    Given the season's predicted match outcomes for a given simulation,
    insert the predictions into the database.
    """
    with conn.cursor() as cur:
        for match in predictions:
            cur.execute(
                f"""
                        INSERT INTO match
                        (simulation_id, home_id, away_id, p_home, p_draw, p_away, prediction, actual)
                        VALUES
                        ({simulation_id}, '{match.home_id}', '{match.away_id}',
                        {match.probabilities.home_win}, {match.probabilities.draw}, {match.probabilities.away_win},
                        '{match.prediction}', '{match.actual}'
                        );
                        """
            )

    conn.commit()
    return simulation_id


def get_predictions(conn: psycopg.Connection, simulation_id: int) -> tuple:
    """
    Given a simulation ID, return all the match predictions associated
    with the simulation.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM match WHERE simulation_id = {simulation_id};")
        out = cur.fetchall()
    
    conn.commit()
    return out


if __name__ == "__main__":
    from backend.db.connection import get_connection
    from backend.sim.predictor import Predictor
    from backend.db.simulations import create_simulation

    conn = get_connection()
    predictor = Predictor()
    matches = predictor.predict_current_season()
    sim_id = create_simulation(conn)
    insert_predictions(conn, sim_id, matches)
    print(get_predictions(conn, sim_id))