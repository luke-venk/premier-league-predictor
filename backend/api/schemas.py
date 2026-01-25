"""Pydantic models for FastAPI to use."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Literal
from datetime import date


class Probability(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    home_win: float = Field(alias="homeWin")
    draw: float
    away_win: float = Field(alias="awayWin")

# TODO: remove?
class Match(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    date: date
    home_id: str = Field(alias="homeId")
    away_id: str = Field(alias="awayId")
    prediction: Literal["home_win", "draw", "away_win"]
    actual: Literal["home_win", "draw", "away_win"]
    probabilities: Probability


# For populating based on PostgreSQL database.
# Avoids nesting in probabilities.
# TODO: standardize
class MatchRow(BaseModel):
    id: int
    simulation_id: int
    home_id: str
    away_id: str
    p_home: float
    p_draw: float
    p_away: float
    prediction: str
    actual: str


# For converting DB layout to frontend layout (found in MatchCard.tsx).
class ProbOut(BaseModel):
    homeWin: float
    draw: float
    awayWin: float


# For converting DB layout to frontend layout (found in MatchCard.tsx).
class MatchOut(BaseModel):
    id: int
    date: date
    homeId: str
    awayId: str
    probabilities: ProbOut
    prediction: str
    actual: str


class Standing(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    position: int
    team_id: str = Field(alias="teamId")
    played: int
    won: int
    drew: int
    lost: int
    points: int


class MatchResponse(BaseModel):
    timestamp: str
    matches: list[Match]


class TableResponse(BaseModel):
    standings: list[Standing]
