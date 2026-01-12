import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const HomePage = () => {
  const [simulation, setSimulation] = useState(false);
  const handleButtonClick = () => {
    setSimulation(!simulation);
  };

  return (
    <>
      <h1>Welcome to Premier League Predictor!</h1>
      <p>For more information on the project, please see the <Link to="/about">About page</Link>.</p>
      <h2>Prediction Simulation Status</h2>
      <Button onClick={handleButtonClick}>Run New Simulation</Button>
      {simulation ? <p>Simulation is TRUE</p> : <p>Simulation is FALSE</p>}
    </>
  );
};

export default HomePage;
