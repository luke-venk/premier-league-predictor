"""
Connects to the Postgres database by reading the DATABASE_URL
and returning a psycopg.Connection.
"""

import psycopg
import os
from dotenv import load_dotenv


def get_connection() -> psycopg.Connection:
    load_dotenv()
    DATABASE_URL = os.environ["DATABASE_URL"]
    conn = psycopg.connect(DATABASE_URL)
    return conn
