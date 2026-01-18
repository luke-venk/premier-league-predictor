import teams from "../../teams.json";

export type TeamId = keyof typeof teams;
export type Result = "home_win" | "draw" | "away_win";

export interface Match {
  date: string;
  homeId: TeamId;
  awayId: TeamId;
  prediction: Result;
  actual: Result;
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}
