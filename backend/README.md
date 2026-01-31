# Backend

## Overview
The backend is built with FastAPI and is responsible for:
- Serving the REST API
- Orchestrating match prediction and table standing computations
- Persisting and retrieving data from PostgreSQL using `psycopg`

## Running the Backend Locally
From the project root, start the development server with:  
`uvicorn backend.main:app --reload`

By default, the API will be available at:  
`http://localhost:8000`

Interactive API documentation is available at:  
`http://localhost:8000/docs`

## Interacting with the API
Endpoints can be accessed via HTTP clients such as `curl`:

curl -X <GET|POST|DELETE> http://localhost:8000/api/<route>

Refer to `backend/api/routes.py` for a complete list of available endpoints and request/response schemas.

## Directory Structure
- api/       Defines API routes and request/response schemas.
- datasets/  Stores CSV data for the current season and metadata for all 20 teams.
- db/        Database connection logic and query helpers for PostgreSQL.
- sim/       Simulation and model logic used to generate match predictions and compute table standings.
