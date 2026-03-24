"use client"

import * as React from "react"
import {
  Reply,
  Forward,
  MoreHorizontal,
  Send,
  VolumeX,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import type { Email } from "./EmailList"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export interface EmailContentProps {
  email: Email | null
}

export function EmailContent({ email }: EmailContentProps) {
  const [reply, setReply] = React.useState("")
  const [mute, setMute] = React.useState(false)

  if (!email) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select an email to read
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>{getInitials(email.sender)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold">{email.sender}</p>
              <p className="text-sm text-muted-foreground truncate">
                Reply to {email.sender.toLowerCase().replace(" ", ".")}@example.com
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon">
              <Reply className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Forward className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem>Report spam</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{email.subject}</h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {email.preview}
        </p>
        <p className="mt-4 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p className="mt-4 text-sm leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident.
        </p>
      </div>

      <div className="border-t border-border/50 p-4">
        <Textarea
          placeholder="Reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={mute}
              onChange={(e) => setMute(e.target.checked)}
              className="rounded border-input"
            />
            <VolumeX className="h-4 w-4" />
            Mute thread
          </label>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
