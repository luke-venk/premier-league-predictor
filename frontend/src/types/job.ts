export type JobId = number;

export type JobStatus = "queued" | "running" | "completed" | "failed";

export type JobPollResponse = {
    ok: boolean;
    jobStatus: JobStatus;
    simulationId: number | null;
};