import pandas as pd
from pathlib import Path
from model.config import POSSESSION_PATH

def merge_possession_into_dataframe(df: pd.DataFrame, possession_csv_path: Path = POSSESSION_PATH) -> pd.DataFrame:
    # Load possession data
    possession_df = pd.read_csv(possession_csv_path)
    possession_df["date"] = pd.to_datetime(possession_df["date"]).dt.date.astype(str)
    
    # Prepare input df
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"]).dt.date.astype(str)
    
    # Drop old possession columns if they exist
    cols_to_drop = ["possession_diff", "home_possession_pct", "away_possession_pct"]
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns])
    
    # Merge
    df = df.merge(
        possession_df[["date", "home_team", "away_team", "home_possession_pct", "away_possession_pct", "possession_diff"]],
        on=["date", "home_team", "away_team"],
        how="left",
        validate="m:1",
    )
    
    return df