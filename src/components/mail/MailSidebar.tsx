"use client"

import {
  Inbox,
  Send,
  FileEdit,
  Archive,
  Trash2,
  Mail,
  MessageCircle,
  Tag,
  ShoppingBag,
  Megaphone,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const folders = [
  { icon: Inbox, label: "Inbox", count: 12 },
  { icon: FileEdit, label: "Drafts", count: 3 },
  { icon: Send, label: "Sent", count: 0 },
  { icon: Mail, label: "Junk", count: 0 },
  { icon: Trash2, label: "Trash", count: 0 },
  { icon: Archive, label: "Archive", count: 0 },
]

const categories = [
  { icon: MessageCircle, label: "Social" },
  { icon: Tag, label: "Updates" },
  { icon: Megaphone, label: "Forums" },
  { icon: ShoppingBag, label: "Shopping" },
  { icon: Megaphone, label: "Promotions" },
]

export function MailSidebar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-[260px] shrink-0 -ml-px flex-col overflow-hidden border-r bg-muted/30",
        className
      )}
    >
      <div className="shrink-0 flex flex-col gap-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">thangphan</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="space-y-1 py-2">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            Folders
          </p>
          {folders.map((f) => (
            <Button
              key={f.label}
              variant="ghost"
              className="w-full justify-between px-2"
            >
              <span className="flex items-center gap-2">
                <f.icon className="h-4 w-4" />
                {f.label}
              </span>
              {f.count > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1">
                  {f.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <div className="space-y-1 py-2">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            Categories
          </p>
          {categories.map((c) => (
            <Button
              key={c.label}
              variant="ghost"
              className="w-full justify-start gap-2 px-2"
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
