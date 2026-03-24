 "use client"

import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const current = i18n.language === "vi" ? "VI" : "EN"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t("header.switchLanguage")}>
          <Languages className="size-4" />
          <span className="sr-only">{t("header.switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("vi")}
          className={i18n.language === "vi" ? "font-medium" : ""}
        >
          Tiếng Việt {current === "VI" ? "✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("en")}
          className={i18n.language === "en" ? "font-medium" : ""}
        >
          English {current === "EN" ? "✓" : ""}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

