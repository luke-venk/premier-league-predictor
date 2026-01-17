from backend.api.schemas import Match, Standing
from backend.api.simulation_store import get_teams


def compute_standings(matches: list[Match]) -> list[Standing]:
    # Generate empty standings for each team before going through matches.
    teams = get_teams()

    # Use a dictionary to map team ID to standings data.
    standings = {}
    for i in range(len(teams)):
        standings[teams[i]] = Standing(
            position=(i + 1),
            teamId=teams[i],
            played=0,
            won=0,
            drew=0,
            lost=0,
            points=0,
        )
        
    # Iterate through each match and update the stats for each team.
    for match in matches:
        pred = match["prediction"]
        
        # Update the number of games played for each team.
        standings[match["home_id"]].played += 1
        standings[match["away_id"]].played += 1
        
        # Update the number of wins, draws, losses, and points for each team.
        if pred == "home_win":
            standings[match["home_id"]].won += 1
            standings[match["home_id"]].points += 3
            
            standings[match["away_id"]].lost += 1
        elif pred == "away_win":
            standings[match["home_id"]].lost += 1
            
            standings[match["away_id"]].won += 1
            standings[match["away_id"]].points += 3
        else:
            standings[match["home_id"]].drew += 1
            standings[match["home_id"]].points += 1
            
            standings[match["away_id"]].drew += 1
            standings[match["away_id"]].points += 1
    
    # Sort the standings based on points.
    standings = list(standings.values())
    standings.sort(key=lambda s: s.points, reverse=True)
    
    # Go through and update the position of each standing.
    for i in range(len(standings)):
        standings[i].position = i + 1

    return standings

if __name__ == "__main__":
    from backend.api.simulation_store import load_simulation
    payload = load_simulation()
    matches = payload["matches"]
    standings = compute_standings(matches)