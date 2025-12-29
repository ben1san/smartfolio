export type SimulationRequest = {
    age: number;
    monthly_investment: number;
    risk_tolerance: number;
    initial_assets?: number;
};

export type SimulationPoint = {
    year: number;
    age: number;
    p10: number;
    p50: number;
    p90: number;
};

export type SimulationResponse = {
    results: SimulationPoint[];
};

const API_URL = "http://localhost:8000/api/v1";

export async function simulateAssets(data: SimulationRequest): Promise<SimulationResponse> {
    const response = await fetch(`${API_URL}/simulate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Simulation failed");
    }

    return response.json();
}
