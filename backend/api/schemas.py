"""Pydantic models for FastAPI to use."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Literal

class Probability(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    home_win: float = Field(alias="homeWin")
    draw: float
    away_win: float = Field(alias="awayWin")


class Match(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    date: str
    home_id: str = Field(alias="homeId")
    away_id: str = Field(alias="awayId")
    prediction: Literal["home_win", "draw", "away_win"]
    actual: Literal["home_win", "draw", "away_win"]
    probabilities: Probability


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
