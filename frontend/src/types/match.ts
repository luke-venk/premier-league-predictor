import teams from "../../teams.json";

export type TeamId = keyof typeof teams;
export type Result = "home_win" | "draw" | "away_win";

export interface Match {
  matchDate: string;
  homeId: TeamId;
  awayId: TeamId;

  p_home: number;
  p_draw: number;
  p_away: number;
    
  prediction: Result;
  actual: Result;
}
