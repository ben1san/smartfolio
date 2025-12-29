"use client"

import { useState } from "react"
import { Wallet, ArrowRight, CheckCircle2, AlertCircle, Banknote, TrendingUp, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// shadcn components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 型定義
type DiagnosisResult = {
  investAmount: number
  targetName: string
  keepAmount: number
  advice: string
}

export default function AiFpPage() {
  const [step, setStep] = useState<"input" | "loading" | "result">("input")
  const [bankBalance, setBankBalance] = useState("")
  const [monthlySurplus, setMonthlySurplus] = useState("")
  const [result, setResult] = useState<DiagnosisResult | null>(null)

  // 擬似的なAPIコール（後でGeminiと接続）

  const handleDiagnose = async () => {
    // コンマを除去して数値化
    const balanceVal = parseInt(bankBalance.replace(/,/g, ""))
    const surplusVal = parseInt(monthlySurplus.replace(/,/g, ""))

    if (isNaN(balanceVal) || isNaN(surplusVal)) return

    setStep("loading")

    try {
      // ▼▼▼ ここを変更（FastAPIのエンドポイントへ） ▼▼▼
      const res = await fetch("http://127.0.0.1:8000/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // キー名をPython側のPydanticモデル(snake_case)に合わせる
        body: JSON.stringify({
          bank_balance: balanceVal,     // camelCase -> snake_case
          monthly_surplus: surplusVal   // camelCase -> snake_case
        }),
      })

      if (!res.ok) throw new Error("Network response was not ok")

      const data = await res.json()

      // レスポンスをStateにセット（キー名はPython側からのJSONに依存）
      setResult({
        investAmount: data.invest_amount, // snake_case -> camelCase
        targetName: data.target_name,
        keepAmount: data.keep_amount,
        advice: data.advice
      })
      setStep("result")

    } catch (error) {
      console.error(error)
      alert("サーバーエラーです。バックエンドが起動しているか確認してください。")
      setStep("input")
    }
  }

  const formatYen = (val: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* ヘッダーエリア */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Financial Planner</h1>
          <p className="text-slate-500 mt-2 text-sm">迷わない。入力して、従うだけ。</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>現状確認</CardTitle>
                  <CardDescription>今の状況を正直に入力してください。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="balance">現在の銀行預金残高</Label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="balance"
                        placeholder="1,500,000"
                        className="pl-9 text-lg"
                        type="number"
                        value={bankBalance}
                        onChange={(e) => setBankBalance(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surplus">今月の余剰資金（給料 - 生活費）</Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="surplus"
                        placeholder="35,000"
                        className="pl-9 text-lg"
                        type="number"
                        value={monthlySurplus}
                        onChange={(e) => setMonthlySurplus(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleDiagnose}
                    disabled={!bankBalance || !monthlySurplus}
                  >
                    アクションを決定する
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-slate-500 text-sm font-medium animate-pulse">最適な配分を計算中...</p>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* アクションカード (メインの指示) */}
              <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
                <div className="bg-primary/10 px-6 py-2 border-b border-primary/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Priority Action</span>
                  <Badge variant="default" className="bg-primary text-primary-foreground">実行必須</Badge>
                </div>
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-slate-500 font-medium mb-1">以下の注文を出してください</p>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight my-4">
                    {formatYen(result.investAmount)}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-slate-800">{result.targetName}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/50 border-t border-primary/10 pt-4 pb-4 justify-center">
                  <Button size="lg" className="w-full font-bold shadow-md hover:shadow-lg transition-all">
                    証券口座を開く
                  </Button>
                </CardFooter>
              </Card>

              {/* Keep指示 (残すお金) */}
              {result.keepAmount > 0 && (
                <Card className="border-slate-200 bg-white shadow-sm border-dashed">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-full">
                        <Banknote className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Do Not Touch</p>
                        <p className="text-sm font-medium text-slate-900">現金として残す</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-slate-700">{formatYen(result.keepAmount)}</span>
                  </CardContent>
                </Card>
              )}

              {/* AIのアドバイス */}
              <Alert className="bg-slate-50 border-slate-200">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <AlertTitle className="text-purple-700 font-bold mb-1">AI FPの解説</AlertTitle>
                <AlertDescription className="text-slate-600 text-sm leading-relaxed">
                  {result.advice}
                </AlertDescription>
              </Alert>

              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-600"
                onClick={() => {
                  setBankBalance("")
                  setMonthlySurplus("")
                  setStep("input")
                }}
              >
                最初に戻る
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}