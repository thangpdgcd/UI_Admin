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
  { source: "Subscriptions", revenue: 18520, fill: "var(--chart-1)" },
  { source: "One-time Sales", revenue: 14230, fill: "var(--chart-2)" },
  { source: "Services", revenue: 10200, fill: "var(--chart-3)" },
  { source: "Partnerships", revenue: 5780, fill: "var(--chart-4)" },
]

const chartConfig = {
  revenue: { label: "Revenue" },
  subscriptions: { label: "Subscriptions", color: "var(--chart-1)" },
  "one-time-sales": { label: "One-time Sales", color: "var(--chart-2)" },
  services: { label: "Services", color: "var(--chart-3)" },
  partnerships: { label: "Partnerships", color: "var(--chart-4)" },
} satisfies ChartConfig

export function RevenueBreakdown() {
  const total = chartData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="rounded-xl border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Revenue Breakdown
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Revenue distribution by source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <ChartContainer
            config={chartConfig}
            className="h-[220px] w-full max-w-[220px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => {
                      const pct = total
                        ? ((Number(value) / total) * 100).toFixed(1)
                        : "0"
                      return [
                        `$${Number(value).toLocaleString()} (${pct}%)`,
                        "Revenue",
                      ]
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="source"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex-1 w-full space-y-3">
            {chartData.map((item) => {
              const pct = total ? ((item.revenue / total) * 100).toFixed(1) : "0"
              return (
                <div
                  key={item.source}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-medium">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-sm font-medium tabular-nums">
                      ${item.revenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground w-12">
                      {pct}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
