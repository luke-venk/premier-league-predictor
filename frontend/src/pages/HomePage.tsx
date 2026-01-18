import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./HomePage.css";
import InfoCard from "../components/InfoCard";

const HomePage = () => {
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>();

  // If a simulation has been run before, get the latest timestamp.
  useEffect(() => {
    const fetchTimestamp = async () => {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const time = data.timestamp;
        setTimestamp(time);
      } catch {
        setTimestamp(null);
      }
    };
    fetchTimestamp();
  }, []);

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
      <InfoCard title="About the Project">
        Soccer is the world's game, and the English Premier League is its
        most-watched sports league in the world.{" "}
        <strong>Premier League Predictor</strong>{" "}
        is a full-stack application I engineered to allow users to use a machine
        learning model to predict the outcomes of Premier League matches for the
        current 2025-2026 season.
      </InfoCard>
      <InfoCard>
        This project builds on prior work in which my colleagues and I developed
        a machine learning model to predict the outcomes of Premier League
        matches. For more information about the model, please see the{" "}
        <Link to="/about">About page</Link>.
      </InfoCard>
      <InfoCard title="Prediction Simulation Status">
        The user will be allowed to run as many simulations as they would like, and this
        application will store each of the simulation results. The user will be able to choose
        which simulation they would like to explore in the <Link to="/matches">Matches page</Link>
        and <Link to="/table">Table page</Link>, although the only difference between each simulation
        will be the Premier League information available at the time of each simulation.
      </InfoCard>
      <div className="latest-sim">
        <div className="latest-sim-label">
          {timestamp ? "Latest Simulation Ran: " : ""}
        </div>
        <div className="latest-sim-timestamp">
          {timestamp
            ? formatTimestamp(timestamp)
            : "Run your first simulation!"}
        </div>
      </div>
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
