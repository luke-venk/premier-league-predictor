import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSimulations } from "../state/simulations";
import Button from "./Button";
import "./SimulationSelect.css";

const SimulationSelect = () => {
  const { simulations, loading, error } = useSimulations();

  // Allow the user to specify simulation IDs via search params.
  // selectedSimId is derived from the URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const simParam = searchParams.get("simulation");
  const selectedSimId = simParam ? Number(simParam) : null;

  // Dropdown draft selection, although selection only occurs when
  // the button is clicked.
  // draftSimId is derived from local state.
  const [draftSimId, setDraftSimId] = useState<number | "">("");
  
  // Keep draft selection in sync when the URL changes.
  useEffect(() => {
    setDraftSimId(selectedSimId ?? "");
  }, [selectedSimId]);

  // Enable applying the selection of the dropdown simulation
  // ID when the button is clicked.
  const applySelection = () => {
    if (draftSimId === "") return;
    const next = new URLSearchParams(searchParams);
    next.set("simulation", String(draftSimId));
    setSearchParams(next);
  };

  if (loading) {
    return <div>Loading simulations...</div>;
  } else if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="simulation-select">
      <div className="simulation-select-container">
        <span className="simulation-select-text">Simulation:</span>

        <label className="simulation-select-dropdown">
          <select
            value={draftSimId}
            onChange={(e) => setDraftSimId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Select a simulation...</option>
            {simulations.map((simulation) => (
              <option key={simulation.id} value={simulation.id}>
                Simulation #{simulation.id} -{" "}
                {new Date(simulation.created_at).toLocaleString()}
              </option>
            ))}
          </select>
        </label>
        
        <Button 
          color="blue"
          size="small"
          onClick={applySelection}
          disabled={draftSimId === "" || draftSimId === selectedSimId}
        >
          Select
        </Button>
      </div>

      <div className="simulation-select-text">
        Currently Selected Simulation: {selectedSimId ?? "None"}
      </div>
    </div>
  );
};

export default SimulationSelect;
