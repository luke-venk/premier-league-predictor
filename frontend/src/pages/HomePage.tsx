import { useState } from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import Button from "../components/Button";
import SimulationSelect from "../components/SimulationSelect";
import "./HomePage.css";

const HomePage = () => {
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);

  // If the simulation button is clicked, disable the button
  // until the backend provides a response.
  const handleButtonClick = async () => {
    if (!runningSimulation) {
      setRunningSimulation(true);
      try {
        await runSimulation();
      } finally {
        setRunningSimulation(false);
      }
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
        <strong>Premier League Predictor</strong>{" "}
        is a full-stack application I engineered to allow users to use a machine
        learning model to predict the outcomes of Premier League matches for the
        2025-2026 season.
      </InfoCard>
      <InfoCard>
        This project builds on prior work in which my colleagues and I developed
        a machine learning model to predict the outcomes of Premier League
        matches. For more information about the model, please see the{" "}
        <Link to="/about">About page</Link>.
      </InfoCard>
      <InfoCard title="Choose Simulation">
        The user will be allowed to run as many simulations as they would like, and the
        application will store each of the simulation results. The user will be able to choose
        which simulation they would like to explore in the {" "}
        <Link to={`/matches`}>Matches page</Link>
        {" "} and {" "}
        <Link to="/table">Table page</Link>.
      </InfoCard>
      <SimulationSelect />
      <br></br>
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
