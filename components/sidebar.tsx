"use client"

import Link from "next/link"
import { Minimize, BookOpen, PenLine, User, Settings, LogOut } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { SidebarTooltip } from "./sidebar-tooltip"

import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const { user } = useAuth()
  return (
    <aside className="hidden sticky top-0 h-screen w-16 sm:flex flex-col items-center justify-center gap-6 py-8 bg-background">
      <ModeToggle />
      <SidebarTooltip label="Articles">
        <Link href="/articles" className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
          <BookOpen className="w-4 h-4" />
        </Link>
      </SidebarTooltip>
      <SidebarTooltip label="Write">
        <Link href="/write" className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
          <PenLine className="w-4 h-4" />
        </Link>
      </SidebarTooltip>
      <SidebarTooltip label="Profile">
        <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
          <User className="w-4 h-4" />
        </Link>
      </SidebarTooltip>
      <SidebarTooltip label="Settings">
        <Link href="/settings" className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
          <Settings className="w-4 h-4" />
        </Link>
      </SidebarTooltip>
      {user && (
        <SidebarTooltip label="Logout">
          <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <LogOut className="w-4 h-4" />
          </button>
        </SidebarTooltip>
      )}
    </aside>
  )
}
