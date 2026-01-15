"""
Loads trained model and historical data, builds and caches rolling features,
and predicts match outcomes for requested fixtures.

The reason it needs to combine historical data with data from the current
season is so that the feature matrix for the current season can compute
"state" features (e.g., form, rolling stats, head-to-head, Elo) with all
historical data. If it only used matches from the current season, these
all would be weaker.
"""

from joblib import load
import pandas as pd

from backend.config import FOOTBALL_DATA_URL, FOOTBALL_DATA_PATH, MODEL_PATH
from backend.api.schemas import Match, Probability
from model.config import END_YEAR, NUM_SEASONS, SPORTSBOOK, N_MATCHES
from model.load_data import get_data_only
from model.build_features import build_rolling_features, get_feature_columns


def get_latest_season() -> pd.DataFrame:
    """Get the latest Premier League data from Football-Data.co.uk to a CSV."""
    df = pd.read_csv(FOOTBALL_DATA_URL)
    # Save to CSV for debugging.
    df.to_csv(FOOTBALL_DATA_PATH, index=False)
    return df


def normalize_current(df: pd.DataFrame, sportsbook: str) -> pd.DataFrame:
    """
    Since current season data only has unnormalized data from FootballData,
    normalize the DataFrame into the same 21-column canonical schema as
    df_historical before concatenating.
    """
    rename_map = {
        "Date": "date",
        "HomeTeam": "home_team",
        "AwayTeam": "away_team",
        "FTHG": "home_goals",
        "FTAG": "away_goals",
        "HST": "home_shots_on_target",
        "AST": "away_shots_on_target",
        "HF": "home_fouls",
        "AF": "away_fouls",
        f"{sportsbook}H": "odds_home_win",
        f"{sportsbook}D": "odds_draw",
        f"{sportsbook}A": "odds_away_win",
        "FTR": "result",
    }
    df = df.rename(columns=rename_map)

    # Parse date (Football-Data is day first)
    df["date"] = pd.to_datetime(df["date"], errors="coerce", dayfirst=True)

    start_year = df["date"].dt.year.where(
        df["date"].dt.month >= 8, df["date"].dt.year - 1
    )
    df["season"] = start_year.astype(float)  # or Int64 if you want

    # Add columns that we don't have yet in current season.
    for col in [
        "home_possession_pct",
        "away_possession_pct",
        "possession_diff",
        "home_squad_value_log_z",
        "away_squad_value_log_z",
        "squad_value_log_advantage_z",
    ]:
        df[col] = float("nan")

    # Keep only the columns your pipeline expects (+ flag you already have)
    keep = [
        "date",
        "home_team",
        "away_team",
        "home_goals",
        "away_goals",
        "home_shots_on_target",
        "away_shots_on_target",
        "home_fouls",
        "away_fouls",
        "result",
        "odds_home_win",
        "odds_draw",
        "odds_away_win",
        "home_possession_pct",
        "away_possession_pct",
        "possession_diff",
        "home_squad_value_log_z",
        "away_squad_value_log_z",
        "squad_value_log_advantage_z",
        "is_current_season",
        "season",
    ]
    return df[keep]


class Predictor:
    def __init__(self):
        # Load the model from the path.
        self.model = load(MODEL_PATH)

        # Get all data from the current season.
        df_current_raw = get_latest_season()
        df_current_raw["is_current_season"] = True
        df_current = normalize_current(df_current_raw, SPORTSBOOK)

        # Determine the teams from this season.
        self.teams = sorted(
            pd.concat([df_current["home_team"], df_current["away_team"]]).unique()
        )

        # Get all historical data from the previous 10 seasons.
        df_historical = get_data_only(END_YEAR, NUM_SEASONS, SPORTSBOOK)
        df_historical["is_current_season"] = False

        # Combine all data into one to engineer features for current season.
        df_all = pd.concat([df_historical, df_current], ignore_index=True)

        # Build the feature matrix.
        self.feature_matrix = build_rolling_features(df_all, N_MATCHES)

        # Cache feature columns from engineered DataFrame.
        self.feature_cols = get_feature_columns(self.feature_matrix.columns)

        # Grab current season engineered rows.
        self.current_feature_matrix = self.feature_matrix[
            self.feature_matrix["is_current_season"]
        ].copy()

        # Impute columns with missing values (valuation, possession).
        # NOTE: A future extension could be rewriting Max's webscraping code
        # to work for the current season. For simplicity, I will just impute
        # using the mean for now.
        for col in [
            "squad_value_log_advantage_z",
            "away_squad_value_log_z",
            "home_squad_value_log_z",
            "possession_diff",
            "away_possession_pct",
            "home_possession_pct",
        ]:
            if col in self.current_feature_matrix.columns and col in self.feature_cols:
                # Impute using mean.
                self.current_feature_matrix[col] = self.current_feature_matrix[
                    col
                ].fillna(self.feature_matrix[col].mean())

    def predict_current_season(self) -> list[Match]:
        """
        Using the feature matrix for the matches in the current season, predict
        the outcome of each match for this Premier League season.
        """
        # Build the current feature matrix with the columns needed for
        # the model to predict an outcome.
        df = self.current_feature_matrix.copy()
        X = df[self.feature_cols]

        # Predict match outcomes.
        probabilities = self.model.predict_proba(X)
        classes = list(self.model.classes_)
        label_map = {0: "home_win", 1: "draw", 2: "away_win"}

        # Determine most likely outcome.
        best_idx = probabilities.argmax(axis=1)
        pred_class_ids = [classes[i] for i in best_idx]
        pred_labels = [label_map[c] for c in pred_class_ids]

        # Extract prob columns by class id.
        idx_home = classes.index(0)
        idx_draw = classes.index(1)
        idx_away = classes.index(2)

        # Probabilities of each outcome.
        p_home = probabilities[:, idx_home]
        p_draw = probabilities[:, idx_draw]
        p_away = probabilities[:, idx_away]

        # Build outputs.
        out = []
        for i, row in enumerate(df.itertuples(index=False)):
            out.append(
                Match(
                    date=(
                        row.date.isoformat()
                        if hasattr(row.date, "isoformat")
                        else str(row.date)
                    ),
                    # TODO: is a rename map needed?
                    home_id=row.home_team,
                    away_id=row.away_team,
                    prediction=pred_labels[i],
                    probabilities=Probability(
                        home_win=float(p_home[i]),
                        draw=float(p_draw[i]),
                        away_win=float(p_away[i]),
                    ),
                )
            )

        return out


if __name__ == "__main__":
    p = Predictor()
    pred = p.predict_current_season()
    print(pred)