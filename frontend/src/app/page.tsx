"use client";

import { useState } from "react";
import { simulateAssets, SimulationResponse } from "@/lib/api";
import { AssetChart } from "@/components/AssetChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResponse | null>(null);

  // Form State
  const [age, setAge] = useState<number>(30);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(50000);
  const [riskTolerance, setRiskTolerance] = useState<number>(50);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await simulateAssets({
        age,
        monthly_investment: monthlyInvestment,
        risk_tolerance: riskTolerance,
        initial_assets: 0,
      });
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Simulation failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Smartfolio AI
          </h1>
          <p className="text-slate-400 text-lg">
            Smart Asset Simulation powered by Monte Carlo Analytics.
          </p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Input Form (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">Parameters</CardTitle>
                <CardDescription>Configure your investment profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Age Input */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-300">Age ({age})</Label>
                  <Slider
                    id="age"
                    min={18}
                    max={80}
                    step={1}
                    value={[age]}
                    onValueChange={(val) => setAge(val[0])}
                    className="py-4"
                  />
                </div>

                {/* Monthly Investment */}
                <div className="space-y-2">
                  <Label htmlFor="investment" className="text-slate-300">
                    Monthly Investment (¥{monthlyInvestment.toLocaleString()})
                  </Label>
                  <Slider
                    id="investment"
                    min={5000}
                    max={500000}
                    step={1000}
                    value={[monthlyInvestment]}
                    onValueChange={(val) => setMonthlyInvestment(val[0])}
                    className="py-4"
                  />
                  <Input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-slate-200 mt-2"
                  />
                </div>

                {/* Risk Tolerance */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-slate-300">Risk Tolerance</Label>
                    <span className="text-sm text-slate-400">{riskTolerance}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[riskTolerance]}
                    onValueChange={(val) => setRiskTolerance(val[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-slate-500">
                    0% = Conservative (Bonds) <br /> 100% = Aggressive (Equities/Crypto)
                  </p>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6"
                  onClick={handleSimulate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    "Run Simulation"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Asset Allocation Suggestion (Static for MVP) */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl opacity-80">
              <CardHeader>
                <CardTitle className="text-slate-200 text-lg">Portfolio Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Global Stocks</span>
                    <span>{riskTolerance}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${riskTolerance}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Bonds / Cash</span>
                    <span>{100 - riskTolerance}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${100 - riskTolerance}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Chart (Spans 8 columns) */}
          <div className="lg:col-span-8">
            {result ? (
              <AssetChart data={result.results} />
            ) : (
              <Card className="h-[500px] flex items-center justify-center bg-slate-900 border-slate-800 text-slate-500 border-dashed border-2">
                <div className="text-center space-y-2">
                  <p className="text-xl">Ready to Simulate</p>
                  <p className="text-sm">Adjust parameters and click "Run Simulation"</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
