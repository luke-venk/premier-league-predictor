import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./HomePage.css";

const HomePage = () => {
  const [runningSimulation, setRunningSimulation] = useState(false);

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

  const runSimulation = async () => {
    const response = await fetch("/api/simulate", { method: "POST" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // TODO: store in database so Matches page can get access?
    // const data = await response.json();
  };

  // TODO: update this with latest time stamp
  const latestTimeRan = "01/12/2025 8:26 PM";

  return (
    <>
      <h1>Welcome to Premier League Predictor!</h1>
      <p>
        For more information on the project, please see the{" "}
        <Link to="/about">About page</Link>.
      </p>
      <h2>Prediction Simulation Status</h2>
      <h3>Latest Time Ran: {latestTimeRan}</h3>
      <Button
        onClick={handleButtonClick}
        className={runningSimulation ? "active" : ""}
        disabled={runningSimulation}
      >
        {runningSimulation ? "Running Simulation..." : "Run New Simulation"}
      </Button>
    </>
  );
};

export default HomePage;
