import numpy as np
import pandas as pd

from model.config import VALUATION_PATH

def merge_valuations_into_dataframe(df: pd.DataFrame, val_csv=VALUATION_PATH) -> pd.DataFrame:
    # Load valuation data
    try:
        val_data = pd.read_csv(val_csv)
        # print(f">>> Loaded valuation data: {len(val_data)} rows")
    except FileNotFoundError:
        print(f"Error: Could not find valuation file: {val_csv}")
        print("Please run scraper first or ensure the file exists.")
        return df
    except Exception as e:
        print(f"Error loading valuation file: {e}")
        return df
    
    # Prepare valuation data
    val_df = val_data[["cutoff_date", "team", "value_eur_at_date", "squad_size_at_date"]].copy()
    val_df["cutoff_date"] = pd.to_datetime(val_df["cutoff_date"], errors="coerce")
    val_df["team_normalized"] = val_df["team"].apply(normalize_team_name)
    val_df = val_df.sort_values(["team_normalized", "cutoff_date"])
    
    # Copy input dataframe
    match_df = df.copy()
    # print(f">>> Processing match data: {len(match_df)} rows")
    
    match_df["_match_date"] = pd.to_datetime(match_df["date"], errors="coerce")
    
    # print(">>> Merging home team valuations...")
    match_df["home_team_normalized"] = match_df["home_team"].apply(normalize_team_name)
    match_df = merge_team_values(match_df, val_df, "home_team_normalized", "_match_date", "home")
    
    # print(">>> Merging away team valuations...")
    match_df["away_team_normalized"] = match_df["away_team"].apply(normalize_team_name)
    match_df = merge_team_values(match_df, val_df, "away_team_normalized", "_match_date", "away")

    if "home_squad_value" in match_df.columns and "away_squad_value" in match_df.columns:
        match_df["home_squad_value"] = pd.to_numeric(match_df["home_squad_value"], errors="coerce")
        match_df["away_squad_value"] = pd.to_numeric(match_df["away_squad_value"], errors="coerce")

        match_df["home_squad_value_log"] = np.log1p(match_df["home_squad_value"])
        match_df["away_squad_value_log"] = np.log1p(match_df["away_squad_value"])

        match_df["squad_value_advantage"] = match_df["home_squad_value"] - match_df["away_squad_value"]
        match_df["squad_value_log_advantage"] = match_df["home_squad_value_log"] - match_df["away_squad_value_log"]

        for col in ["home_squad_value_log", "away_squad_value_log", "squad_value_log_advantage"]:
            mean = match_df[col].mean(skipna=True)
            std = match_df[col].std(skipna=True)
            if std and not np.isnan(std):
                match_df[col + "_z"] = (match_df[col] - mean) / std
            else:
                match_df[col + "_z"] = pd.NA

        match_df = match_df.drop(
            columns=[
                "home_squad_value",
                "away_squad_value",
                "home_squad_value_log",
                "away_squad_value_log",
                "squad_value_advantage",
                "squad_value_log_advantage",
            ],
            errors="ignore",
        )
    
    match_df = match_df.drop(columns=["home_team_normalized", "away_team_normalized", "_match_date"], errors="ignore")
    
    # print(">>> Added/updated columns: home_squad_size, away_squad_size, home_squad_value_log_z, away_squad_value_log_z, squad_value_log_advantage_z")
    
    return match_df

def normalize_team_name(name):
    if pd.isna(name):
        return name
    name = str(name).strip()

    name_map = {
        "Man City": "Manchester City",
        "Man United": "Manchester United",
        "Man Utd": "Manchester United",
        "Nott'm Forest": "Nottingham Forest",
        "Nottm Forest": "Nottingham Forest",
        "Wolves": "Wolverhampton Wanderers",
        "Brighton": "Brighton & Hove Albion",
        "Tottenham": "Tottenham Hotspur",
        "Spurs": "Tottenham Hotspur",
        "Newcastle": "Newcastle United",
        "West Ham": "West Ham United",
        "Leicester": "Leicester City",
        "Ipswich": "Ipswich Town",
        "Luton": "Luton Town",
        "Sheffield Utd": "Sheffield United",
        "Sheff Utd": "Sheffield United",
        "Sheffield U.": "Sheffield United",
        "Southampton": "Southampton FC",
        "Cardiff": "Cardiff City",
        "Huddersfield": "Huddersfield Town",
        "Hull": "Hull City",
        "Middlesbrough": "Middlesbrough FC",
        "Norwich": "Norwich City",
        "Stoke": "Stoke City",
        "Swansea": "Swansea City",
        "Watford": "Watford FC",
        "West Brom": "West Bromwich Albion",
        "Leeds": "Leeds United",
        "Arsenal FC": "Arsenal",
        "AFC Bournemouth": "Bournemouth",
        "Brentford FC": "Brentford",
        "Brighton & Hove Albion": "Brighton & Hove Albion",
        "Burnley FC": "Burnley",
        "Chelsea FC": "Chelsea",
        "Everton FC": "Everton",
        "Fulham FC": "Fulham",
        "Liverpool FC": "Liverpool",
        "Sunderland AFC": "Sunderland",
    }

    return name_map.get(name, name)

def merge_team_values(match_df, val_df, team_col_normalized, date_col_for_merge, prefix):
    merged = match_df.copy()
    value_col = f"{prefix}_squad_value"
    if value_col not in merged:
        merged[value_col] = None

    for idx, row in merged.iterrows():
        team_normalized = row[team_col_normalized]
        match_date = row[date_col_for_merge]
        team_vals = val_df[(val_df["team_normalized"] == team_normalized) & (val_df["cutoff_date"] <= match_date)]
        if not team_vals.empty:
            latest = team_vals.iloc[-1]
            merged.at[idx, value_col] = latest["value_eur_at_date"]
    return merged