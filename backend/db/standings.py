"""
Helper functions to insert standings into simulations and query
table standings given a simulation.
"""

import psycopg
from backend.api.schemas import Standing


def insert_standings(
    conn: psycopg.Connection, simulation_id: int, standings: list[Standing]
) -> int:
    """
    Given the computed standings for a simulation, insert the standings into
    the database.
    """
    with conn.cursor() as cur:
        for standing in standings:
            cur.execute(
                f"""
                        INSERT INTO standing
                        (simulation_id, team_id, position, played, won, drew, lost, points)
                        VALUES
                        ({simulation_id}, '{standing.team_id}', {standing.position}, {standing.played}, {standing.won}, {standing.drew}, {standing.lost}, {standing.points});
                        """
            )

    conn.commit()
    return simulation_id


def get_standings(conn: psycopg.Connection, simulation_id: int) -> list[Standing]:
    """
    Given a simulation ID, return all the table standings associated
    with the simulation.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM standing WHERE simulation_id = {simulation_id};")
        out = cur.fetchall()
    
    return out


if __name__ == "__main__":
    # TODO: remove
    from backend.db.connection import get_connection
    from backend.db.simulations import create_simulation
    from backend.sim.predictor import Predictor
    from backend.sim.generate_table import compute_standings

    conn = get_connection()
    predictor = Predictor()
    matches = predictor.predict_current_season()
    standings = compute_standings(matches)
    print(f"The type of standings is: {type(standings)}")

    sim_id = create_simulation(conn)
    insert_standings(conn, sim_id, standings)
    print(get_standings(conn, sim_id))