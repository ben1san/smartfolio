from pydantic import BaseModel, Field
from typing import List, Dict

class SimulationRequest(BaseModel):
    age: int = Field(..., ge=18, le=80, description="Current age of the user")
    monthly_investment: float = Field(..., ge=1000, le=10000000, description="Monthly investment amount in JPY")
    risk_tolerance: int = Field(..., ge=0, le=100, description="Risk tolerance percentage (0-100)")
    initial_assets: float = Field(0, ge=0, description="Current assets available for investment")

class SimulationPoint(BaseModel):
    year: int
    age: int
    p10: int = Field(..., description="10th percentile (Conservative)")
    p50: int = Field(..., description="50th percentile (Median)")
    p90: int = Field(..., description="90th percentile (Optimistic)")

class SimulationResponse(BaseModel):
    results: List[SimulationPoint]
