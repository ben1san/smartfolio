import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

type RiskQuizProps = {
  onComplete: (data: { age: number; monthlyInvestment: number; riskTolerance: number }) => void;
  isLoading: boolean;
};

export default function RiskQuiz({ onComplete, isLoading }: RiskQuizProps) {
  const [step, setStep] = useState(1);

  // Basic Info State
  const [age, setAge] = useState<number>(30);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(50000);

  // Quiz State
  const [q1, setQ1] = useState<number | null>(null); // Market drop reaction
  const [q2, setQ2] = useState<number | null>(null); // Investment goal

  const handleNext = () => {
    setStep(2);
  };

  const calculateRiskAndSubmit = () => {
    if (q1 === null || q2 === null) return;

    // Simple logic: Average of the two answers (0-100 scale)
    // Q1 weights: A=10, B=50, C=90
    // Q2 weights: A=10, B=50, C=90
    const riskScore = (q1 + q2) / 2;

    // Normalize to 0-100 integer if needed, but logic above already does 0-100 scale essentially
    // Actually, let's map it cleanly to 0-100
    // e.g. Minimal Risk: 10, Max Risk: 90

    onComplete({
      age,
      monthlyInvestment,
      riskTolerance: riskScore,
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          診断パラメータ
        </CardTitle>
        <CardDescription>
          {step === 1 ? "基本情報を入力してください" : "リスク許容度診断 (残り2問)"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 ? (
          /* Step 1: Basic Inputs */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-200">現在の年齢 (歳)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                min={18}
                max={80}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-200">毎月の積立額 (円)</Label>
                <span className="text-indigo-400 font-mono font-bold">¥{monthlyInvestment.toLocaleString()}</span>
              </div>
              <Slider
                value={[monthlyInvestment]}
                onValueChange={(vals) => setMonthlyInvestment(vals[0])}
                max={300000}
                step={1000}
                className="py-4"
              />
              <p className="text-xs text-slate-500 text-right">※つみたて投資枠上限: ¥100,000/月</p>
            </div>
          </div>
        ) : (
          /* Step 2: Risk Quiz */
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Q1 */}
            <div className="space-y-3">
              <Label className="text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Q1. 保有資産が一時的に30%減りました。どうしますか？
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "すぐに売却して損失を防ぐ", value: 10 },
                  { label: "様子を見る (何もしない)", value: 50 },
                  { label: "チャンスと思い買い増す", value: 90 },
                ].map((option) => (
                  <Button
                    key={option.label}
                    variant={q1 === option.value ? "default" : "outline"}
                    className={`justify-start text-left h-auto py-3 ${q1 === option.value ? 'bg-indigo-600 border-indigo-500 hover:bg-indigo-700' : 'bg-slate-950 border-slate-700 hover:bg-slate-800 hover:text-white'}`}
                    onClick={() => setQ1(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="space-y-3">
              <Label className="text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Q2. 投資の主な目的は？
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "資産を減らさずに守りたい", value: 10 },
                  { label: "インフレに負けない程度に増やしたい", value: 50 },
                  { label: "リスクを取ってでも最大限増やしたい", value: 90 },
                ].map((option) => (
                  <Button
                    key={option.label}
                    variant={q2 === option.value ? "default" : "outline"}
                    className={`justify-start text-left h-auto py-3 ${q2 === option.value ? 'bg-indigo-600 border-indigo-500 hover:bg-indigo-700' : 'bg-slate-950 border-slate-700 hover:bg-slate-800 hover:text-white'}`}
                    onClick={() => setQ2(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        )}
      </CardContent>

      <CardFooter>
        {step === 1 ? (
          <Button
            onClick={handleNext}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            次へ (リスク診断)
          </Button>
        ) : (
          <Button
            onClick={calculateRiskAndSubmit}
            disabled={q1 === null || q2 === null || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 shadow-lg shadow-indigo-900/20"
          >
            {isLoading ? "AI解析を実行中..." : "AI診断結果を見る"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
