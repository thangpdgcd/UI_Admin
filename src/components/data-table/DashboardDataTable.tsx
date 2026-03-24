"use client"

import * as React from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type TableStatus = "active" | "draft" | "pending" | "archived"

export interface TableRowData {
  id: string
  header: string
  sectionType: string
  status: TableStatus
  target: string
  limit: string
  reviewer: string
}

const statusStyles: Record<TableStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  draft: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  pending: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  archived: "bg-muted text-muted-foreground border-border",
}

const mockData: TableRowData[] = [
  { id: "1", header: "Executive Summary", sectionType: "Overview", status: "active", target: "Q1 2025", limit: "5 pages", reviewer: "Jane Smith" },
  { id: "2", header: "Market Analysis", sectionType: "Research", status: "draft", target: "Q2 2025", limit: "10 pages", reviewer: "John Doe" },
  { id: "3", header: "Financial Projections", sectionType: "Finance", status: "pending", target: "Q1 2025", limit: "8 pages", reviewer: "Jane Smith" },
  { id: "4", header: "Risk Assessment", sectionType: "Compliance", status: "active", target: "Q3 2025", limit: "6 pages", reviewer: "Bob Wilson" },
  { id: "5", header: "Technical Requirements", sectionType: "Engineering", status: "archived", target: "Q4 2024", limit: "12 pages", reviewer: "John Doe" },
  { id: "6", header: "Marketing Strategy", sectionType: "Marketing", status: "draft", target: "Q2 2025", limit: "7 pages", reviewer: "Jane Smith" },
  { id: "7", header: "Operations Plan", sectionType: "Operations", status: "pending", target: "Q1 2025", limit: "9 pages", reviewer: "Bob Wilson" },
  { id: "8", header: "HR Policies", sectionType: "Legal", status: "active", target: "Q2 2025", limit: "4 pages", reviewer: "John Doe" },
]

const PAGE_SIZES = [5, 10, 20, 50]

export function DashboardDataTable() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const totalPages = Math.ceil(mockData.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedData = mockData.slice(startIndex, startIndex + pageSize)

  const toggleAll = () => {
    if (selected.size === paginatedData.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(paginatedData.map((row) => row.id)))
    }
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const isAllSelected =
    paginatedData.length > 0 && selected.size === paginatedData.length
  const isSomeSelected = selected.size > 0

  return (
    <div className="min-w-0 space-y-4">
      <div className="min-w-0 overflow-x-auto rounded-xl border border-border/50 bg-card/95 shadow-sm backdrop-blur-sm">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected || (isSomeSelected && "indeterminate")}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Header</TableHead>
              <TableHead>Section Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(row.id)}
                    onCheckedChange={() => toggleRow(row.id)}
                    aria-label={`Select ${row.header}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.header}</TableCell>
                <TableCell>{row.sectionType}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize border",
                      statusStyles[row.status]
                    )}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>{row.target}</TableCell>
                <TableCell>{row.limit}</TableCell>
                <TableCell>{row.reviewer}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(startIndex + pageSize, mockData.length)} of{" "}
            {mockData.length}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
