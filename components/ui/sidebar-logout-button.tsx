"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface SidebarLogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarLogoutButton({ className, children }: SidebarLogoutButtonProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogoutClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      router.push("/discover")
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleLogoutClick}
        className={className || "w-10 h-10 rounded hover:bg-muted"}
      >
        {children || <LogOut className="w-4 h-4" />}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your MINISPACE account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
