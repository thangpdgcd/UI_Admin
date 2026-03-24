"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/cards/MetricCard"

const growthData = [
  { month: "Jan", new: 120, returning: 85 },
  { month: "Feb", new: 145, returning: 92 },
  { month: "Mar", new: 130, returning: 110 },
  { month: "Apr", new: 165, returning: 98 },
  { month: "May", new: 152, returning: 125 },
  { month: "Jun", new: 178, returning: 142 },
]

const chartConfig = {
  new: {
    label: "New customers",
    color: "var(--chart-1)",
  },
  returning: {
    label: "Returning customers",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CustomerInsights() {
  const isMobile = useIsMobile()

  return (
    <Card className="rounded-xl border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Customer Insights
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Understand your customer base and growth trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth">
          <TabsList>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>
          <TabsContent value="growth" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <ChartContainer
                config={chartConfig}
                className="h-[280px] w-full"
              >
                <BarChart
                  data={growthData}
                  margin={
                    isMobile
                      ? { top: 8, right: 8, bottom: 8, left: 8 }
                      : { top: 8, right: 16, bottom: 8, left: 16 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar
                    dataKey="new"
                    fill="var(--color-new)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="returning"
                    fill="var(--color-returning)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Customer Growth Trends</h4>
                <MetricCard
                  title="Total Customers"
                  value="1,234"
                  change="+12%"
                  positive={true}
                  description="Active this month"
                />
                <MetricCard
                  title="Retention Rate"
                  value="78%"
                  change="+3%"
                  positive={true}
                  description="Returning customers"
                />
                <MetricCard
                  title="Avg LTV"
                  value="$892"
                  change="+5%"
                  positive={true}
                  description="Lifetime value"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="demographics" className="mt-6">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30 text-muted-foreground">
              Demographics content coming soon
            </div>
          </TabsContent>
          <TabsContent value="regions" className="mt-6">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30 text-muted-foreground">
              Regions content coming soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
