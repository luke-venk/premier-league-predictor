-- 02_add_jobs.sql
--
-- Creates a table for jobs, allowing a worker to consume from the Redis
-- queue, enabling asyncrhony.
--
-- Added as a secondary SQL schema initialization script to emulate how
-- migrations happen in industry. When a new data volume is initialized,
-- it will run all scripts in this directory.

BEGIN;

CREATE TABLE job (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    job_status VARCHAR(10) NOT NULL DEFAULT 'queued',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    simulation_id BIGINT REFERENCES simulation(id),
    error VARCHAR(50)
);

COMMIT;