"""
Connects to the Postgres database by reading the DATABASE_URL
and returning a psycopg.Connection.
"""

import psycopg
from psycopg.rows import dict_row
import os
from dotenv import load_dotenv


def get_connection() -> psycopg.Connection:
    # Use .env to load the URL pointing to the PostgreSQL database.
    load_dotenv()
    DATABASE_URL = os.environ["DATABASE_URL"]
    
    # Cursors should return dictionaries instead of arrays.
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    
    return conn
