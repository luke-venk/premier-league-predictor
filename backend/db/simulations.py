"""
Has functions to facilitate creating and fetching simulations
in Postgres.
"""

import psycopg


def create_simulation(conn: psycopg.Connection) -> int:
    """
    Creates a new simulation in the database, and returns
    the simulation ID.
    """
    with conn.cursor() as cur:
        cur.execute("INSERT INTO simulation DEFAULT VALUES RETURNING id;")
        row = cur.fetchone()

    return row["id"]


def list_simulations(conn: psycopg.Connection) -> list[tuple]:
    """
    Lists all simulations in the database.
    """
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM simulation;")
        answer = cur.fetchall()

    return answer


def get_simulation(conn: psycopg.Connection, simulation_id: int) -> tuple:
    """
    Given a specific simulation ID, return the simulation from the database.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM simulation WHERE id = {simulation_id};")
        answer = cur.fetchone()

    return answer

def delete_simulations(conn: psycopg.Connection) -> None:
    """
    Completely empties the simulation, match, and standing tables. Also
    restarts their auto-incrementing IDs and clears dependent tables.
    
    Returns true if successful.
    """
    with conn.cursor() as cur:
        cur.execute("""TRUNCATE TABLE simulation, match, standing
                    RESTART IDENTITY
                    CASCADE;""")
