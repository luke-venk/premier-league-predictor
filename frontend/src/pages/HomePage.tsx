import { useState } from "react";
import { useSimulations } from "../state/simulations";
import { Link, useSearchParams } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import Button from "../components/Button";
import SimulationSelect from "../components/SimulationSelect";
import "./HomePage.css";

const HomePage = () => {
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  const { refresh } = useSimulations();

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  // If the simulation button is clicked, disable the button
  // until the backend provides a response.
  const handleRunSimulation = async () => {
    if (runningSimulation) return;
    setRunningSimulation(true);
    try {
      await runSimulation();
      // Update the SimulationSelect dropdowns everywhere once
      // the simulation is done running.
      await refresh();
    } finally {
      setRunningSimulation(false);
    }
  };

  // Run the simulation and update the timestamp on the home page.
  const runSimulation = async () => {
    const res = await fetch("/api/simulate", { method: "POST" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  };

  // Allow the user to clear all the simulations they have run.
  const handleClearSimulations = async () => {
    // Clear simulations from database.
    const res = await fetch("/api/simulations", { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // Clear the simulation query parameter from the URL.
    const next = new URLSearchParams(searchParams);
    next.delete("simulation");
    setSearchParams(next);

    // Refresh simulation select.
    await refresh();
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
        <Button
          onClick={handleRunSimulation}
          disabled={runningSimulation}
          color="green"
          size="large"
        >
          {runningSimulation ? "Running Simulation..." : "Run New Simulation"}
        </Button>

        <Button
          onClick={handleClearSimulations}
          disabled={runningSimulation}
          color="red"
          size="large"
        >
          Clear All Simulations
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
