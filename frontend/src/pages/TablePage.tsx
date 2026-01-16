import type { Standing } from "../types/standing";
import TableCard from "../components/TableCard";
import "./TablePage.css";

const TablePage = () => {
  const standing1: Standing = {
    position: 1,
    teamId: "ARS",
    played: 6,
    won: 3,
    drew: 2,
    lost: 1,
    points: 11,
  };
  const standing2: Standing = {
    position: 2,
    teamId: "MCI",
    played: 6,
    won: 3,
    drew: 2,
    lost: 1,
    points: 11,
  };
  const standing3: Standing = {
    position: 3,
    teamId: "AVL",
    played: 6,
    won: 3,
    drew: 2,
    lost: 1,
    points: 11,
  };
  const standing4: Standing = {
    position: 4,
    teamId: "LIV",
    played: 6,
    won: 3,
    drew: 2,
    lost: 1,
    points: 11,
  };
  const standing5: Standing = {
    position: 5,
    teamId: "BRE",
    played: 6,
    won: 3,
    drew: 2,
    lost: 1,
    points: 11,
  };
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
        <TableCard standing={standing1} />
        <TableCard standing={standing2} />
        <TableCard standing={standing3} />
        <TableCard standing={standing4} />
        <TableCard standing={standing5} />
      </div>
    </div>
  );
};

export default TablePage;
