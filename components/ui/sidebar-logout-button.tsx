"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface SidebarLogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarLogoutButton({ className, children }: SidebarLogoutButtonProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleLogout}
      className={className || "w-10 h-10 rounded hover:bg-muted"}
    >
      {children || <LogOut className="w-4 h-4" />}
    </Button>
  )
}
