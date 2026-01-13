from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI()

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

matches = [
  {
    "date": "01-01-2026",
    "homeId": "ARS",
    "awayId": "LIV",
    "prediction": "draw",
    "probabilities": {"homeWin": 0.25, "draw": 0.5, "awayWin": 0.25}
  },
  {
    "date": "02-01-2026",
    "homeId": "NEW",
    "awayId": "LEE",
    "prediction": "home_win",
    "probabilities": {"homeWin": 0.8, "draw": 0.1, "awayWin": 0.1}
  },
  {
    "date": "03-01-2026",
    "homeId": "WHU",
    "awayId": "NFO",
    "prediction": "away_win",
    "probabilities": {"homeWin": 0.4, "draw": 0.1, "awayWin": 0.5}
  }
]

@app.get("/api/simulate", response_model=SimulateResponse)
def simulate():
  return {
    "matches": matches
  }