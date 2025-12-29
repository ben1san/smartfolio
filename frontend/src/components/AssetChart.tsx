"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SimulationPoint } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetChartProps {
  data: SimulationPoint[];
}

export function AssetChart({ data }: AssetChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumSignificantDigits: 3,
    }).format(value);
  };

  return (
    <Card className="h-full bg-slate-950 border-slate-800 text-slate-100 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Future Asset Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="age"
              stroke="#64748b"
              label={{ value: "Age", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => `¥${value / 10000}M`}
              stroke="#64748b"
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                color: "#e2e8f0",
              }}
              formatter={(value: any) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Age: ${label}`}
            />
            {/* 90th Percentile (Optimistic) */}
            <Area
              type="monotone"
              dataKey="p90"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorP90)"
              name="Optimistic (Top 10%)"
            />
            {/* 50th Percentile (Median) */}
            <Area
              type="monotone"
              dataKey="p50"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorP50)"
              name="Median"
            />
            {/* 10th Percentile (Conservative) - Just a line usually, or filled lower */}
            <Area
              type="monotone"
              dataKey="p10"
              stroke="#ef4444"
              fill="none"
              name="Conservative (Bottom 10%)"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
