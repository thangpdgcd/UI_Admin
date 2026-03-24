"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { date: "2024-01", sales: 186 },
  { date: "2024-02", sales: 305 },
  { date: "2024-03", sales: 237 },
  { date: "2024-04", sales: 412 },
  { date: "2024-05", sales: 348 },
  { date: "2024-06", sales: 521 },
  { date: "2024-07", sales: 439 },
  { date: "2024-08", sales: 498 },
  { date: "2024-09", sales: 567 },
  { date: "2024-10", sales: 612 },
  { date: "2024-11", sales: 589 },
  { date: "2024-12", sales: 678 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SalesChart() {
  const isMobile = useIsMobile()
  const [range, setRange] = React.useState("12m")

  const filteredData = React.useMemo(() => {
    const months = range === "6m" ? 6 : range === "3m" ? 3 : 12
    return chartData.slice(-months)
  }, [range])

  return (
    <Card className="rounded-xl border border-border/50 bg-card/95 shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Monthly sales trend</CardDescription>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={filteredData}
            margin={
              isMobile
                ? { top: 8, right: 8, bottom: 8, left: 8 }
                : { top: 8, right: 16, bottom: 8, left: 16 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value + "-01").toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value + "-01").toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="var(--color-sales)"
              fill="var(--color-sales)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
