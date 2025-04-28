"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "./ui/button"
import { PenLine, User, Settings, LogOut, Loader2 } from "lucide-react"

export function Navbar() {
  const { user, logout, loggingOut } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on landing page
  if (pathname === "/") return null

  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/articles" className="font-bold text-lg">
            MINI
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/articles"
                className={`hover:text-blue-500 transition-colors ${pathname === "/articles" ? "text-blue-500" : ""}`}
              >
                Read
              </Link>
              <Link
                href="/write"
                className={`hover:text-blue-500 transition-colors ${pathname === "/write" ? "text-blue-500" : ""}`}
              >
                <Button variant="ghost" size="sm" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Write
                </Button>
              </Link>
              <Link
                href="/profile"
                className={`hover:text-blue-500 transition-colors ${pathname === "/profile" ? "text-blue-500" : ""}`}
              >
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link
                href="/settings"
                className={`hover:text-blue-500 transition-colors ${pathname === "/settings" ? "text-blue-500" : ""}`}
              >
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => logout()} disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/articles"
                className={`hover:text-blue-500 transition-colors ${pathname === "/articles" ? "text-blue-500" : ""}`}
              >
                Read
              </Link>
              <Link
                href="/login"
                className={`hover:text-blue-500 transition-colors ${pathname === "/login" ? "text-blue-500" : ""}`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`hover:text-blue-500 transition-colors ${pathname === "/signup" ? "text-blue-500" : ""}`}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
