import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Match } from "../types/match";
import MatchCard from "../components/MatchCard";
import SimulationSelect from "../components/SimulationSelect";
import "./MatchesPage.css";

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Allow the user to specify simulation IDs via search params.
  const [searchParams] = useSearchParams();
  const simId = searchParams.get("simulation");

  // Load the matches.
  useEffect(() => {
    const load = async () => {
      try {
        const url = `/api/matches?simulation=${simId}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch matches.");
        } else {
          const data = await res.json();
          setMatches(data);
        }
      } catch (e: any) {
        setError(e.message ?? "Unknown error.");
      } finally {
        setLoading(false);
      }
    };
    if (simId) {
      load();
    } else {
      setLoading(false);
    }
  }, [simId]);

  return (
    <div className="matches-page">
      <h1>Match Predictions</h1>
      <SimulationSelect />

      <div className="match-header">
        <div className="match-header-cell date">Date</div>
        <div className="match-header-cell prediction">Prediction</div>
        <div className="match-header-cell correct">Correct?</div>
      </div>

      {loading && <div className="status">Loading match predictions...</div>}
      {error && <div className="status error">Error: {error}</div>}

      {!matches.length ? (
        <div className="empty">
          <p>No simulation results. Please select a valid simulation.</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => {
            return (
              <MatchCard
                key={`${match.matchDate}-${match.homeId}-${match.awayId}`}
                match={match}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
