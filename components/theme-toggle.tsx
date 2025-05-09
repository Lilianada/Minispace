"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  text?: string;
}

export function ThemeToggle({ text }: ThemeToggleProps = {}) {
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
      size={text ? "sm" : "icon"}
      aria-label={label}
      onClick={() => setTheme(nextTheme)}
      className="transition-colors block w-fit flex items-center gap-2"
    >
      <Icon className="h-5 w-5" />
      {text && <span>{text}</span>}
    </Button>
  )
}
