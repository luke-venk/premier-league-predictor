import teams from "../../teams.json";

export type TeamId = keyof typeof teams;

export interface Standing {
    position: number;
    teamId: TeamId;
    played: number;
    won: number;
    drew: number;
    lost: number;
    points: number;
}