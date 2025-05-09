"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Menu, Minimize, } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { IssueDialog } from "./issue-dialog"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't show navbar on landing page
  if (pathname === "/") return null

  return (
    <nav className="border-b p-4 sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex justify-between items-center ">
        {/* Mobile: show logo only */}
        <div className="flex items-center gap-2">
          <Minimize className="h-5 w-5" />
          <Link href="/" className="font-bold text-lg">
            MINISPACE
          </Link>
        </div>
        {/* Mobile Navigation */}
        <div className="">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 flex flex-col justify-between">
              <div className="flex flex-col gap-6 p-4">
                <SheetTitle>
                  <Link href="/discover" className="font-bold text-lg mb-4 flex items-center gap-2 px-2 py-2">
                    MINISPACE
                  </Link>
                </SheetTitle>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/login" ? "bg-muted" : ""}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 rounded-md hover:bg-muted ${pathname === "/signup" ? "bg-muted" : ""}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Signup
                </Link>

                <div className="flex items-center gap-2 hover:bg-muted cursor-pointer rounded-lg px-2">
                  <ThemeToggle text="Switch" /> 
                </div>
              </div>
              <div className="flex flex-col gap-6 p-4">
                <IssueDialog />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
