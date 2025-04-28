"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid rendering theme-dependent UI until mounted on client
    return null
  }

  const isDark = theme === "dark"
  const nextTheme = isDark ? "light" : "dark"
  const Icon = isDark ? Sun : Moon
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(nextTheme)}
      className="transition-colors block w-fit"
    >
      <Icon className="h-5 w-5" />
    </Button>
  )
}
