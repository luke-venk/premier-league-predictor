"""
Connects to the Postgres database by reading the DATABASE_URL
and returning a psycopg.Connection.
"""

import psycopg
from psycopg.rows import dict_row

from backend.config import DATABASE_URL


def get_connection() -> psycopg.Connection:
    # Cursors should return dictionaries instead of arrays.
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    return conn
