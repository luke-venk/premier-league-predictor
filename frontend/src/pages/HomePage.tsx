import { Link, useSearchParams } from "react-router-dom";
import { useSimulations } from "../state/SimulationProvider";
import { useJobs } from "../state/JobProvider";
import InfoCard from "../components/InfoCard";
import Button from "../components/Button";
import SimulationSelect from "../components/SimulationSelect";
import "./HomePage.css";

const HomePage = () => {
  // URL search parameters for the specific simulation.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  // Function to clear all data from the simulation store.
  const { clearData } = useSimulations();

  // Function to enqueue jobs.
  const { enqueueJob } = useJobs();

  // Begin the simulation by enqueuing the job.
  const handleRunSimulation = async () => {
    const res = await fetch("/api/simulate", { method: "POST" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    } else {
      const data = await res.json();
      enqueueJob(data.jobId);
    }
  };

  // Allow the user to clear all the simulations they have run.
  const handleClearSimulations = async () => {
    // Clear simulations from database.
    await clearData();

    // Clear the simulation query parameter from the URL.
    const next = new URLSearchParams(searchParams);
    next.delete("simulation");
    setSearchParams(next);
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
        <Button onClick={handleRunSimulation} color="green" size="large">
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
