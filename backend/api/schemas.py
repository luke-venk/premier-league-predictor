"""Pydantic models for FastAPI to use."""

from pydantic import BaseModel, Field
from typing import Literal

class Probability(BaseModel):
  home_win: float = Field(alias="homeWin")
  draw: float
  away_win: float = Field(alias="awayWin")

class Match(BaseModel):
  date: str
  home_id: str = Field(alias="homeId")
  away_id: str = Field(alias="awayId")
  prediction: Literal["home_win", "draw", "away_win"]
  probabilities: Probability
  
class SimulateResponse(BaseModel):
  matches: list[Match]