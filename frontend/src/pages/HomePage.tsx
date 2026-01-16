import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./HomePage.css";

const HomePage = () => {
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [timestamp, setTimestamp] = useState("Run your first simulation.");

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
    // TODO: store in database so Matches page can get access?
    const data = await res.json();
    const time = data.timestamp;
    setTimestamp(time);
  };

  // Format the timestamp for user-friendliness.
  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <h1>Welcome to Premier League Predictor!</h1>
      <p>
        For more information on the project, please see the{" "}
        <Link to="/about">About page</Link>.
      </p>
      <h2>Prediction Simulation Status</h2>
      <h3>Latest Simulation Ran: {formatTimestamp(timestamp)}</h3>
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
