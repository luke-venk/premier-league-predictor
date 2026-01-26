"""
Helper functions to insert standings into simulations and query
table standings given a simulation.
"""

import psycopg
from backend.api.schemas import Standing


def insert_standings(
    conn: psycopg.Connection, simulation_id: int, standings: list[Standing]
) -> None:
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


def get_standings(conn: psycopg.Connection, simulation_id: int) -> list[Standing]:
    """
    Given a simulation ID, return all the table standings associated
    with the simulation.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM standing WHERE simulation_id = {simulation_id};")
        out = cur.fetchall()
    
    return out
