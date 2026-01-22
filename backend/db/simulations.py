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
    
    conn.commit()
    return row[0]

def list_simulations(conn: psycopg.Connection) -> list[tuple]:
    """
    Lists all simulations in the database.
    """
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM simulation;")
        answer = cur.fetchall()
    
    conn.commit()
    return answer

def get_simulation(conn: psycopg.Connection, simulation_id: int) -> None:
    """
    Given a specific simulation ID, return the simulation from the database.
    """
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM simulation WHERE id = {simulation_id};")
        answer = cur.fetchone()
    
    conn.commit()
    return answer

if __name__ == "__main__":
    from backend.db.connection import get_connection
    conn = get_connection()
    print(create_simulation(conn))
    answer = list_simulations(conn)
    print(answer)
    print(get_simulation(conn, 5))
    conn.close()