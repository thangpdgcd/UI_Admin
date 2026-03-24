"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export type TransactionStatus = "completed" | "pending" | "failed"

export interface Transaction {
  id: string
  userName: string
  email: string
  status: TransactionStatus
  amount: string
  time: string
}

const statusStyles: Record<TransactionStatus, string> = {
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  failed: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export interface TransactionListProps {
  transactions: Transaction[]
  className?: string
}

export function TransactionList({ transactions, className }: TransactionListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="text-xs">
                {getInitials(tx.userName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{tx.userName}</p>
              <p className="text-xs text-muted-foreground truncate">{tx.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Badge
              variant="outline"
              className={cn("capitalize border", statusStyles[tx.status])}
            >
              {tx.status}
            </Badge>
            <span className="font-medium tabular-nums">{tx.amount}</span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {tx.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
