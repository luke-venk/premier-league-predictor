import teams from "../../teams.json";
import type { Standing } from "../types/standing";
import "./TableCard.css";

interface Props {
  standing: Standing;
}

const TableCard = ({ standing }: Props) => {
  const team = teams[standing.teamId].name;
  const logo = teams[standing.teamId].logo;

  return (
    <div className="standings-row">
      <div className="standings-cell position">{standing.position}</div>
      <div className="team-cell">
        <img src={`/logos/${logo}`} alt={`${team} logo`}></img>
        <div className="team-name">{team}</div>
        <div className="team-acronym">({standing.teamId})</div>
      </div>
      <div className="standings-cell">{standing.played}</div>
      <div className="standings-cell">{standing.won}</div>
      <div className="standings-cell">{standing.drew}</div>
      <div className="standings-cell">{standing.lost}</div>
      <div className="standings-cell">{standing.points}</div>
    </div>
  );
};

export default TableCard;
