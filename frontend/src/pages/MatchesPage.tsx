import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Match } from "../types/match";
import MatchCard from "../components/MatchCard";
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
        const url = simId ? `/api/matches?simulation=${simId}` : "/api/matches"
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
    load();
  }, [simId]);

  if (loading) {
    return <div>Loading match predictions...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else {
    if (!matches.length) {
      return (
        <div className="matches-page empty">
          <h1>Match Predictions</h1>
          <p>
            No simulation results. Please select a valid simulation from the {" "}
            <Link to="/">Home Page</Link>.
          </p>
          
        </div>    
      )
    }

    return (
      <div className="matches-page">
        <h1>Match Predictions</h1>
        <div className="match-header">
          <div className="match-header-cell date">Date</div>
          <div className="match-header-cell prediction">Prediction</div>
          <div className="match-header-cell correct">Correct?</div>
        </div>

        {matches.map((match) => {
          return <MatchCard 
            key={`${match.matchDate}-${match.homeId}-${match.awayId}`}
            match={match}
          />;
        })}
      </div>
    );
  }
};

export default MatchesPage;
