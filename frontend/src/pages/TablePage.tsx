import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Standing } from "../types/standing";
import TableCard from "../components/TableCard";
import SimulationSelect from "../components/SimulationSelect";
import "./TablePage.css";

const TablePage = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Allow the user to specify simulation IDs via search params.
  const [searchParams] = useSearchParams();
  const simId = searchParams.get("simulation");

  useEffect(() => {
    const load = async () => {
      try {
        const url = simId ? `/api/table?simulation=${simId}` : "/api/table";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch table.");
        } else {
          const data = await res.json();
          setStandings(data);
        }
      } catch (e: any) {
        setError(e.message ?? "Unknown error.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [simId]);

  return (
    <div className="table-page">
      <h1>Table Predictions</h1>
      <SimulationSelect />

      <div className="table-grid table-header">
        <div className="table-header-cell">Pos</div>
        <div className="table-header-cell team">Team</div>
        <div className="table-header-cell">Pl</div>
        <div className="table-header-cell">W</div>
        <div className="table-header-cell">D</div>
        <div className="table-header-cell">L</div>
        <div className="table-header-cell">Pts</div>
      </div>

      {loading && <div className="status">Loading match predictions...</div>}
      {error && <div className="status error">Error: {error}</div>}

      {!standings.length ? (
        <div className="empty">
          <p>
            No simulation results. Please select a valid simulation from the{" "}
            <Link to="/">Home Page</Link>.
          </p>
        </div>
      ) : (
        <div className="table-container">
          {standings.map((standing) => {
            return <TableCard key={standing.position} standing={standing} />;
          })}
        </div>
      )}
    </div>
  );
};

export default TablePage;
