ALTER TABLE job
ADD CONSTRAINT job_status_valid
CHECK (job_status IN ('queued', 'running', 'completed', 'failed'));