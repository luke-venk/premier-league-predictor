import { useState, useEffect } from "react";
import { useSimulations } from "../state/simulations";
import { Link, useSearchParams } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import Button from "../components/Button";
import SimulationSelect from "../components/SimulationSelect";
import "./HomePage.css";
import { toast } from "react-toastify";

const HomePage = () => {
  // URL search parameters for the specific simulation.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  // Function to update the simulation store.
  const { refresh } = useSimulations();

  // Store queue of all currently running job IDs.
  const [activeJobIds, setActiveJobIds] = useState<number[]>([]);

  // Begin the simulation by enqueuing the job.
  const runSimulation = async () => {
    const res = await fetch("/api/simulate", { method: "POST" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    } else {
      const data = await res.json();
      setActiveJobIds((ids) => (ids.includes(data.jobId) ? ids : [...ids, data.jobId]));
      toast.info(`Simulation #${data.jobId} began`);
    }
  };

  // Poll all active jobs to check if they are complete. Upon each job
  // completion, update the simulation store.
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
                return {id: id, data: await response.json()};
              }
            })
          );

          // (2) Determine all completed and failed jobs in the last tick.
          const completedJobs = results.filter((r) => r.data?.jobStatus == "completed");
          const failedJobs = results.filter((r) => r.data?.jobStatus == "failed");

          // (3) Side effects: refreshing simulation store, toast notifications, etc.
          if (completedJobs.length > 0) {
            // Refresh the simulation store.
            await refresh();
            
            // Update the search parameter with the latest simulation completed in the previous tick.
            const simId = completedJobs[completedJobs.length - 1].data.simulationId;
            const next = new URLSearchParams(searchParams);
            next.set("simulation", String(simId));
            setSearchParams(next);
            
            // Toast notification.
            toast.success(`Simulation #${simId} complete!`);
          }

          for (const r of failedJobs) {
            // Toast notification.
            toast.error(`Simulation #${r.id} failed...`);
          }

          // (4) Remove finished jobs from list.
          const finishedIds = new Set<number>([
            ...completedJobs.map((r) => r.id),
            ...failedJobs.map((r) => r.id)
          ]);
          setActiveJobIds((ids) => ids.filter((id) => !finishedIds.has(id)));
        } catch (e) {
          console.log("Polling failed: ", e)
        }
      })();
    }, 1000);
    
    // Cleanup function to clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [activeJobIds, searchParams, setSearchParams, refresh, toast]);

  // Allow the user to clear all the simulations they have run.
  const handleClearSimulations = async () => {
    // Clear simulations from database.
    const res = await fetch("/api/simulations", { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    } else {
      // Clear the simulation query parameter from the URL.
      const next = new URLSearchParams(searchParams);
      next.delete("simulation");
      setSearchParams(next);

      // Refresh simulation select.
      await refresh();

      // Inform the user the data has been cleared.
      toast.info("All simulations have been deleted");
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome to Premier League Predictor!</h1>
      <InfoCard title="About the Project">
        Soccer is the world's game, and the English Premier League is its
        most-watched sports league in the world.{" "}
        <strong>Premier League Predictor</strong> is a full-stack application I
        engineered to allow users to use a machine learning model to predict the
        outcomes of Premier League matches for the 2025-2026 season.
      </InfoCard>
      <InfoCard>
        This project builds on prior work in which my colleagues and I developed
        a machine learning model to predict the outcomes of Premier League
        matches. For more information about the model, please see the{" "}
        <Link to="/about">About page</Link>.
      </InfoCard>
      <InfoCard title="Choose Simulation">
        The user can run as many simulations as they'd like, and they can
        explore the results of any simulation they have run in the{" "}
        <Link to={`/matches${suffix}`}>Matches page</Link> and{" "}
        <Link to={`/table${suffix}`}>Table page</Link>.
      </InfoCard>

      <SimulationSelect />

      <div className="button-row">
        <Button onClick={runSimulation} color="green" size="large">
          Run New Simulation
        </Button>

        <Button onClick={handleClearSimulations} color="red" size="large">
          Clear All Simulations
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
