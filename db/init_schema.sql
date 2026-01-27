-- init_schema.sql
--
-- Initializes the PostgreSQL schema for this application.
-- Creates tables for simulations, match predictions, and table standings.
--
-- Intended to be run once, when setting up a new database.
-- Can be executed again through `db/clean_db.sh` if a fresh
-- database is desired.

BEGIN;

CREATE TABLE simulation (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE match (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    simulation_id BIGINT NOT NULL REFERENCES simulation(id),
    match_date DATE NOT NULL,

    home_id VARCHAR(3) NOT NULL,
    away_id VARCHAR(3) NOT NULL,

    p_home DOUBLE PRECISION NOT NULL CHECK (p_home BETWEEN 0 and 1),
    p_draw DOUBLE PRECISION NOT NULL CHECK (p_draw BETWEEN 0 and 1),
    p_away DOUBLE PRECISION NOT NULL CHECK (p_away BETWEEN 0 and 1),

    prediction VARCHAR(8) NOT NULL CHECK (prediction IN ('home_win', 'draw', 'away_win')),
    actual VARCHAR(8) NOT NULL CHECK (actual IN ('home_win', 'draw', 'away_win'))

);

CREATE TABLE standing (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    simulation_id BIGINT NOT NULL REFERENCES simulation(id),
    
    team_id VARCHAR(3) NOT NULL,
    position SMALLINT NOT NULL,

    played SMALLINT NOT NULL,
    won SMALLINT NOT NULL,
    drew SMALLINT NOT NULL,
    lost SMALLINT NOT NULL,
    points SMALLINT NOT NULL
);

COMMIT;