from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.simulation import SimulationRequest, SimulationResponse
from app.services.calculation import calculate_projection

app = FastAPI(title="Smartfolio API", description="AI-powered Asset Simulation API", version="0.1.0")

# CORS setup for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/simulate", response_model=SimulationResponse)
async def simulate_assets(request: SimulationRequest):
    """
    Simulates asset progression based on risk profile and investment data.
    """
    simulation_data = calculate_projection(request)
    return SimulationResponse(results=simulation_data)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
