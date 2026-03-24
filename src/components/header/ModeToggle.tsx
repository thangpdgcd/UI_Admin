"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface ModeToggleProps {
  variant?: "outline" | "ghost" | "default"
}

export function ModeToggle({ variant = "outline" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { t } = useTranslation()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-colors duration-300"
    >
      <span className="relative block transition-transform duration-300">
        {isDark ? (
          <Sun className="size-4 rotate-180 transition-transform duration-300" />
        ) : (
          <Moon className="size-4 transition-transform duration-300" />
        )}
      </span>
      <span className="sr-only">
        {isDark ? t("header.switchToLight") : t("header.switchToDark")}
      </span>
    </Button>
  )
}
