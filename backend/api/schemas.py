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
    probabilities: Probability


class SimulationResponse(BaseModel):
    timestamp: str
    matches: list[Match]
