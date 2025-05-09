"use client"

import { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex-1 w-full">
      {children}
    </div>
  )
}
