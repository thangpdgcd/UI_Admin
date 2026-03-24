"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Coffee", revenue: 4520, fill: "var(--chart-1)" },
  { category: "Pastries", revenue: 2380, fill: "var(--chart-2)" },
  { category: "Merchandise", revenue: 1890, fill: "var(--chart-3)" },
  { category: "Beverages", revenue: 1420, fill: "var(--chart-4)" },
  { category: "Other", revenue: 790, fill: "var(--chart-5)" },
]

const chartConfig = {
  revenue: { label: "Revenue" },
  coffee: { label: "Coffee", color: "var(--chart-1)" },
  pastries: { label: "Pastries", color: "var(--chart-2)" },
  merchandise: { label: "Merchandise", color: "var(--chart-3)" },
  beverages: { label: "Beverages", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

export function RevenueDonut() {
  const total = chartData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="rounded-xl border border-border/50 bg-card/95 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Revenue distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const pct = total ? ((Number(value) / total) * 100).toFixed(1) : "0"
                    return [`$${Number(value).toLocaleString()} (${pct}%)`, "Revenue"]
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
