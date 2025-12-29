import numpy as np
from typing import List
from app.models.simulation import SimulationRequest, SimulationPoint

def calculate_projection(request: SimulationRequest, years: int = 30, simulations: int = 1000) -> List[SimulationPoint]:
    """
    Simulates future asset growth using Geometric Brownian Motion (Monte Carlo method).
    """
    
    # 1. Map Risk to Mu/Sigma
    # Simple linear interpolation for MVP
    min_mu, max_mu = 0.01, 0.07
    min_sigma, max_sigma = 0.02, 0.18
    
    risk_ratio = request.risk_tolerance / 100.0
    mu = min_mu + (max_mu - min_mu) * risk_ratio
    sigma = min_sigma + (max_sigma - min_sigma) * risk_ratio
    
    # 2. Setup Simulation
    dt = 1/12 # Monthly steps for contribution
    n_steps = years * 12
    
    # Pre-compute random shocks: standard normal distribution
    random_shocks = np.random.normal(0, 1, (simulations, n_steps))
    
    # Storage for monthly values
    assets = np.zeros((simulations, n_steps + 1))
    assets[:, 0] = request.initial_assets
    
    monthly_inv = request.monthly_investment
    
    # 3. Run Step-by-Step
    drift = (mu - 0.5 * sigma**2) * dt
    diffusion = sigma * np.sqrt(dt)
    
    for t in range(n_steps):
        growth = np.exp(drift + diffusion * random_shocks[:, t])
        assets[:, t+1] = assets[:, t] * growth + monthly_inv
        
    # 4. Aggregate Yearly Results
    yearly_indices = np.arange(12, n_steps + 1, 12)
    
    results = []
    
    # Initial point (Year 0)
    results.append(SimulationPoint(
        year=0,
        age=request.age,
        p10=int(request.initial_assets),
        p50=int(request.initial_assets),
        p90=int(request.initial_assets)
    ))
    
    for i, month_idx in enumerate(yearly_indices):
        current_year = i + 1
        year_assets = assets[:, month_idx]
        
        # Calculate percentiles
        p10 = np.percentile(year_assets, 10)
        p50 = np.percentile(year_assets, 50)
        p90 = np.percentile(year_assets, 90)
        
        results.append(SimulationPoint(
            year=current_year,
            age=request.age + current_year,
            p10=int(p10),
            p50=int(p50),
            p90=int(p90)
        ))
        
    return results
