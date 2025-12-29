from app.models.simulation import PortfolioAllocation

def get_portfolio_allocation(risk_tolerance: int) -> PortfolioAllocation:
    """
    Returns a portfolio allocation based on risk tolerance (0-100).
    """
    if risk_tolerance < 30:
        return PortfolioAllocation(
            name="Conservative Strategy",
            allocations=[
                "Global Bonds: 70%",
                "Global Stocks: 30%"
            ],
            description="Focus on capital preservation with minimal volatility. Suitable for short-term goals or risk-averse investors."
        )
    elif risk_tolerance < 70:
        return PortfolioAllocation(
            name="Balanced Strategy",
            allocations=[
                "Global Stocks: 70%",
                "Global Bonds: 30%"
            ],
            description="A balanced approrach aiming for growth while mitigating downsides. Suitable for medium-term goals."
        )
    else:
        return PortfolioAllocation(
            name="Aggressive Strategy",
            allocations=[
                "Global Stocks (All Country): 100%"
            ],
            description="Maximizing long-term growth potential. High volatility is expected but higher returns are likely over 15+ years."
        )
