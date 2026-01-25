import { useEffect, useState } from "react";
import type { Standing } from "../types/standing";
import TableCard from "../components/TableCard";
import "./TablePage.css";
import { Link } from "react-router-dom";

const TablePage = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: replace this all by getting data from database
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/table");
        if (!res.ok) {
          throw new Error("Failed to fetch table.");
        } else {
          const data = await res.json();
          setStandings(data);
        }
      } catch (e: any) {
        setError(e.message ?? "Unknown error.")
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  
  if (loading) {
    return <div>Loading table...</div>
  } else if (error) {
    return <div>Error: {error}</div>;
  } else {
    if (!standings.length) {
      return (
        <div className="table-page empty">
          <h1>Table Predictions</h1>
          <p>
            No simulation results yet. Please run a simulation from the {" "}
            <Link to="/">Home Page</Link>.
          </p>
        </div>
      )
    }
  }

  return (
    <div className="table-page">
      <h1>Table Predictions</h1>
      <div className="table-grid table-header">
        <div className="table-header-cell">Pos</div>
        <div className="table-header-cell team">Team</div>
        <div className="table-header-cell">Pl</div>
        <div className="table-header-cell">W</div>
        <div className="table-header-cell">D</div>
        <div className="table-header-cell">L</div>
        <div className="table-header-cell">Pts</div>
      </div>
      <div className="table-container">
        {standings.map((standing) => {
          return <TableCard
            key={standing.position}
            standing={standing}
          />
        })}
      </div>
    </div>
  );
};

export default TablePage;
