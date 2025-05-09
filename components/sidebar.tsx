"use client"

import Link from "next/link"
import { 
  Home, 
  PenLine, 
  User, 
  Settings, 
  FileText,
  AlertCircle,
  LogOut,
  BookOpen
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { SidebarTooltip } from "./sidebar-tooltip"
import { SidebarLogoutButton } from "./ui/sidebar-logout-button"

interface SidebarProps {
  username: string;
  userData?: any;
}

export function IconSidebar({ username }: SidebarProps) {
  return (
    <aside className="hidden sticky top-0 h-screen w-16 md:flex flex-col items-center justify-between gap-4 py-8 bg-background border-r">
      <div className="flex flex-col items-center gap-6 mt-6">
        {/* Main navigation items */}
        <SidebarTooltip label="Home">
          <Link href={`/${username}/dashboard`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <Home className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Posts">
          <Link href={`/${username}/dashboard/posts`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <PenLine className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Pages">
          <Link href={`/${username}/dashboard/pages`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <FileText className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Blog Settings">
          <Link href={`/${username}/dashboard/blog/settings`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <BookOpen className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Profile">
          <Link href={`/${username}/dashboard/profile`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <User className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Settings">
          <Link href={`/${username}/dashboard/settings`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <Settings className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
        
        <SidebarTooltip label="Issues">
          <Link href={`/${username}/dashboard/issues`} className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted">
            <AlertCircle className="w-4 h-4" />
          </Link>
        </SidebarTooltip>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <ModeToggle />
        <SidebarTooltip label="Logout">
          <SidebarLogoutButton />
        </SidebarTooltip>
      </div>
    </aside>
  )
}

export default function Sidebar({ username }: SidebarProps) {
  return <IconSidebar username={username} />
}
