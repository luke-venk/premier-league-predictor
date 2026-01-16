import { useEffect, useState } from "react";
import type { Match } from "../types/match";
import MatchCard from "../components/MatchCard";
import "./MatchesPage.css";
import { Link } from "react-router-dom";

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: replace this all by getting data from database
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/matches");
        if (!response.ok) {
          throw new Error("Failed to fetch matches.");
        } else {
          const data = await response.json();
          setMatches(data.matches);
        }
      } catch (e: any) {
        setError(e.message ?? "Unknown error.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div>Loading simulation...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else {
    if (!matches.length) {
      return (
        <div className="matches-page empty">
          <h1>Match Predictions</h1>
          <p>
            No simulation results yet. Please run a simulation from the {" "}
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
            key={`${match.date}-${match.homeId}-${match.awayId}`}
            match={match}
          />;
        })}
      </div>
    );
  }
};

export default MatchesPage;
