"use client"

import { Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { SiteHeader } from "@/components/header/SiteHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

interface DashboardLayoutProps {
  title?: string
  description?: string
}

// Routes that should use full-bleed padding (content starts right next to the sidebar)
const FULL_BLEED_PATHS = ["/chat", "/mail", "/calendar", "/system/settings", "/settings", "/tasks"]

export function DashboardLayout({
  title,
  description,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isFullBleed = FULL_BLEED_PATHS.some((p) => location.pathname.startsWith(p))

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar ?? "",
        }}
        onLogout={logout}
      />
      <SidebarInset>
        <SiteHeader compactPadding={isFullBleed} />
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto",
            isFullBleed && "gap-0 p-0",
            !isFullBleed && "gap-4 p-3 md:gap-5 md:p-5 bg-muted/20"
          )}
        >
          {(title || description) && (
            <div className="space-y-1 shrink-0">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <div
            className={cn(
              isFullBleed && "min-h-0 min-w-0 w-full flex-1 flex overflow-hidden pl-0"
            )}
          >
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
