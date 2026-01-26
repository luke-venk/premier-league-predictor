import { useState, useEffect } from "react";
import type { Simulation } from "../types/simulation";
import Button from "./Button";
import "./SimulationSelect.css";

interface Props {
  value: number | null;
  onChange: (id: number) => void;
}

const SimulationSelect = ({ value, onChange }: Props) => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the list of simulations from the /simulations endpoint.
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/simulations");
      if (!res.ok) {
        throw new Error("Failed to fetch simulations");
      } else {
        const data = await res.json();
        setSimulations(data);
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div>Loading simulations...</div>;
  }

  return (
    <div>
      <div className="simulation-select-container">
        <div className="simulation-select-text">Simulation:</div>
        <label className="simulation-select-dropdown">
          <select
            value={value ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
          >
            {simulations.map((simulation) => (
              <option key={simulation.id} value={simulation.id}>
                Simulation #{simulation.id} -{" "}
                {new Date(simulation.created_at).toLocaleString()}
              </option>
            ))}
          </select>
        </label>
        <Button color="blue" size="small">
          Select
        </Button>
      </div>
      <div className="simulation-status">
        <div className="simulation-select-text">Currently Selected Simulation: </div>
      </div>
    </div>
  );
};

export default SimulationSelect;
