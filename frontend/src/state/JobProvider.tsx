import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import type { JobId, JobPollResponse } from "../types/job";
import { toast } from "react-toastify";
import type { Simulation } from "../types/simulation";

// Define what lives inside the context for TypeScript.
type JobContextValue = {
  enqueueJob: (jobId: JobId) => void;
  activeJobIds: JobId[];
};

// Initialize the jobs context to null.
const JobContext = createContext<JobContextValue | null>(null);

type JobProviderProps = {
  children: React.ReactNode;

  // Allow callback to function to be passed to decouple JobProvider
  // and logic to update the simulation store.
  refreshSimulations: () => Promise<Simulation[]>;

  // Allow callback to function to be passed to decouple JobProvider
  // and logic to update the search params.
  onSimulationCompleted?: (simId: number) => void;
};

export function JobProvider({
  children,
  refreshSimulations,
  onSimulationCompleted,
}: JobProviderProps) {
  // Store queue of all currently running job IDs.
  const [activeJobIds, setActiveJobIds] = useState<JobId[]>([]);

  // Keep latest callbacks without forcing interval to restart.
  const refreshRef = useRef(refreshSimulations);
  const simCompleteRef = useRef(onSimulationCompleted);

  useEffect(() => {
    refreshRef.current = refreshSimulations;
  }, [refreshSimulations]);

  useEffect(() => {
    simCompleteRef.current = onSimulationCompleted;
  }, [onSimulationCompleted]);

  // Exported helper function for when a job is queued from a different component.
  const enqueueJob = useCallback((jobId: JobId) => {
    setActiveJobIds((ids) => (ids.includes(jobId) ? ids : [...ids, jobId]));
    toast.info(`Simulation #${jobId} began`);
  }, []);

  useEffect(() => {
    // This poll and update should only run there are any active jobs.
    if (activeJobIds.length === 0) return;

    // Every second, poll each running job in parallel.
    const interval = setInterval(() => {
      (async () => {
        try {
          // (1) Store results of each poll.
          const results = await Promise.all(
            activeJobIds.map(async (id) => {
              const response = await fetch(`/api/jobs?job_id=${id}`);
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              } else {
                return {
                  id: id,
                  data: (await response.json()) as JobPollResponse,
                };
              }
            }),
          );

          // (2) Determine all completed and failed jobs in the last tick.
          const completedJobs = results.filter(
            (r) => r.data?.jobStatus == "completed",
          );
          const failedJobs = results.filter(
            (r) => r.data?.jobStatus == "failed",
          );

          // (3) Side effects: refreshing simulation store, toast notifications, etc.
          if (completedJobs.length > 0) {
            // Refresh the simulation store.
            await refreshRef.current();

            // Update the search parameter with the latest simulation completed in the previous tick.
            const simId =
              completedJobs[completedJobs.length - 1].data.simulationId;

            if (simId != null && simCompleteRef.current) {
              simCompleteRef.current(simId);
            }

            for (const r of completedJobs) {
              // Toast notification.
              toast.success(`Simulation #${r.data.simulationId} complete!`);
            }
          }

          for (const r of failedJobs) {
            // Toast notification.
            toast.error(`Simulation #${r.data.simulationId} failed...`);
          }

          // (4) Remove finished jobs from list.
          const finishedIds = new Set<JobId>([
            ...completedJobs.map((r) => r.id),
            ...failedJobs.map((r) => r.id),
          ]);
          setActiveJobIds((ids) => ids.filter((id) => !finishedIds.has(id)));
        } catch (e) {
          console.log("Polling failed: ", e);
        }
      })();
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [activeJobIds]);

  // Only recreate this object if its contents actually change.
  const value = useMemo(
    () => ({ enqueueJob, activeJobIds }),
    [enqueueJob, activeJobIds],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobs must be used within JobProvider");
  return ctx;
}