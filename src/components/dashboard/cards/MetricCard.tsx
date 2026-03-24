"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface MetricCardProps {
  title: string
  value: string
  change: string
  positive: boolean
  description?: string
  footer?: string
  icon?: LucideIcon
  iconClassName?: string
}

export function MetricCard({
  title,
  value,
  change,
  positive,
  description,
  footer,
  icon: Icon,
  iconClassName,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "group rounded-xl border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm",
        "transition-all duration-200 hover:shadow-md hover:border-border/80",
        "dark:bg-card/90 dark:hover:bg-card"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                "bg-primary/10 text-primary",
                iconClassName
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 border font-medium",
              positive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl font-bold tracking-tight md:text-3xl">
          {value}
        </div>
        {description && (
          <CardDescription className="mt-1.5">{description}</CardDescription>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="text-xs text-muted-foreground pt-0">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
