"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "./ui/button"
import { PenLine, User, Settings, LogOut, Loader2, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { IssueDialog } from "./issue-dialog"

export function Navbar() {
  const { user, logout, loggingOut } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-sm">
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                {user ? (
                  <>
                    <Link
                      href="/articles"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/articles" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Read
                    </Link>
                    <Link
                      href="/write"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/write" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <PenLine className="h-4 w-4" />
                        Write
                      </span>
                    </Link>
                    <Link
                      href="/profile"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/profile" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </span>
                    </Link>
                    <Link
                      href="/settings"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/settings" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </span>
                    </Link>
                    <div className="px-4 py-2">
                      <IssueDialog />
                    </div>
                    <button
                      className={`px-4 py-2 rounded-md hover:bg-muted text-left flex items-center gap-2 ${
                        loggingOut ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        if (!loggingOut) {
                          setIsOpen(false)
                          logout()
                        }
                      }}
                      disabled={loggingOut}
                    >
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
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/articles"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/articles" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Read
                    </Link>
                    <Link
                      href="/login"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/login" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/signup" ? "bg-muted" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Signup
                    </Link>
                    <div className="px-4 py-2">
                      <IssueDialog />
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
