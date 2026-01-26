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

  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  // If the simulation button is clicked, disable the button
  // until the backend provides a response.
  const handleButtonClick = async () => {
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

  return (
    <>
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
        The user will be allowed to run as many simulations as they would like,
        and the application will store each of the simulation results. The user
        will be able to choose which simulation they would like to explore in
        the <Link to={`/matches${suffix}`}>Matches page</Link> and{" "}
        <Link to={`/table${suffix}`}>Table page</Link>.
      </InfoCard>

      <SimulationSelect />

      <Button
        onClick={handleButtonClick}
        disabled={runningSimulation}
        color="green"
        size="large"
        className={runningSimulation ? "active" : ""}
      >
        {runningSimulation ? "Running Simulation..." : "Run New Simulation"}
      </Button>
    </>
  );
};

export default HomePage;
