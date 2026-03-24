"use client"

import {
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  Calendar,
  Settings,
  Users,
  Package,
  ShoppingCart,
  FolderTree,
} from "lucide-react"
import { Logo } from "@/components/Logo"
import { NavMain } from "@/components/sidebar/NavMain"
import { NavUser } from "@/components/sidebar/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslation } from "react-i18next"

export function AppSidebar({
  user,
  onLogout,
}: {
  user: { name: string; email: string; avatar?: string | null }
  onLogout: () => void
}) {
  const { t } = useTranslation()

  const navGroups = [
    {
      label: t("nav.main"),
      items: [
        { title: t("menu.dashboard"), url: "/system/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: t("nav.apps"),
      items: [
        { title: t("menu.mail"), url: "/mail", icon: Mail },
        { title: t("menu.tasks"), url: "/tasks", icon: CheckSquare },
        { title: t("menu.chat"), url: "/chat", icon: MessageCircle },
        { title: t("menu.calendar"), url: "/calendar", icon: Calendar },
      ],
    },
    {
      label: t("nav.management"),
      items: [
        { title: t("menu.users"), url: "/system/users", icon: Users },
        { title: t("menu.products"), url: "/system/products", icon: Package },
        { title: t("menu.orders"), url: "/system/orders", icon: ShoppingCart },
        { title: t("menu.categories"), url: "/system/categories", icon: FolderTree },
      ],
    },
    {
      label: t("nav.settingsGroup"),
      items: [{ title: t("menu.settings"), url: "/system/settings", icon: Settings }],
    },
  ]

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo size={28} className="px-2" />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 text-xs text-muted-foreground">
          {t("app.name")}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavMain
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? "",
          }}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
