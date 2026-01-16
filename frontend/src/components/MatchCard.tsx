import { useState } from "react";
import teams from "../../teams.json";
import type { Match } from "../types/match";
import "./MatchCard.css";

interface Props {
  match: Match;
}

const MatchCard = ({ match }: Props) => {
  const result = match.prediction;

  const [showPrediction, setShowPrediction] = useState(false);
  const clickHandler = () => {
    setShowPrediction((prev) => !prev);
  };

  const homeTeam = teams[match.homeId].name;
  const homeLogo = teams[match.homeId].logo;
  const homeClass =
    result == "home_win" ? "winner" : result == "away_win" ? "loser" : "draw";

  const awayTeam = teams[match.awayId].name;
  const awayLogo = teams[match.awayId].logo;
  const awayClass =
    result == "away_win" ? "winner" : result == "home_win" ? "loser" : "draw";

  return (
    <div className="matchcard">
      <div className="matchdate">{match.date}</div>

      <div
        className={`matchpill ${result} ${showPrediction ? "expanded" : ""}`}
        onClick={clickHandler}
        role="button"
      >
        {showPrediction ? (
          <div className="probpill">
            <div
              className="probseg home"
              style={{
                flex: match.probabilities.homeWin,
                backgroundColor: teams[match.homeId].color.primary,
                color: teams[match.homeId].color.secondary,
              }}
            >
              {Math.round(match.probabilities.homeWin * 100)}%
            </div>
            <div className="probseg draw" style={{
              flex: match.probabilities.draw
            }}>
              {Math.round(match.probabilities.draw * 100)}%
            </div>
            <div className="probseg away" style={{
              flex: match.probabilities.awayWin,
              backgroundColor: teams[match.awayId].color.primary,
              color: teams[match.awayId].color.secondary
            }}>
              {Math.round(match.probabilities.awayWin * 100)}%
            </div>
          </div>
        ) : (
          <>
            <div className="segment home">
              <div className={`team home ${homeClass}`}>
                <span className="teamname">{homeTeam}</span>
                <img src={`/logos/${homeLogo}`} alt={`${homeTeam} logo`} />
              </div>
            </div>

            <div className="segment mid">
              <div className="vs">vs.</div>
            </div>

            <div className="segment away">
              <div className={`team away ${awayClass}`}>
                <img src={`/logos/${awayLogo}`} alt={`${awayTeam} logo`} />
                <span className="teamname">{awayTeam}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
