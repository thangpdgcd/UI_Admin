"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
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
import { Download } from "lucide-react"

const chartData = [
  { date: "2024-01", sales: 18600 },
  { date: "2024-02", sales: 30500 },
  { date: "2024-03", sales: 23700 },
  { date: "2024-04", sales: 41200 },
  { date: "2024-05", sales: 34800 },
  { date: "2024-06", sales: 52100 },
  { date: "2024-07", sales: 43900 },
  { date: "2024-08", sales: 49800 },
  { date: "2024-09", sales: 56700 },
  { date: "2024-10", sales: 61200 },
  { date: "2024-11", sales: 58900 },
  { date: "2024-12", sales: 67800 },
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
    <Card className="rounded-xl border border-border/50 shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Sales Performance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Monthly sales vs targets
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
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
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Sales",
                  ]}
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
