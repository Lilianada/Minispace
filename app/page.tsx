"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Minimize } from "lucide-react"

export default function Home() {
  const phrases = ["Read and Write without all the noise", "The true definition of minimalism"]

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 ">
        <div>
          <Link href="/articles" className="hover:text-blue-500 transition-colors text-sm">
            Start Reading
          </Link>
        </div>
        <div className="flex gap-4">
         
          <Link href="/login" className="text-sm hover:text-blue-500 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-sm hover:text-blue-500 transition-colors">
            Signup
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <Minimize className="h-5 w-5" />
        <h1 className="text-2xl font-semibold ">MINI</h1>
        <div className="">
          <TypewriterEffect phrases={phrases} />
        </div>
      
      </main>

      {/* Footer */}
      <footer className="p-4  flex justify-between">
        <span className="text-sm text-muted-foreground">Truly minimal</span>
        <span className="text-sm text-muted-foreground">Built for simplicity.</span>
      </footer>
     
    </div>
  )
}

function DebugEnvironmentVariables() {
  const [showDebug, setShowDebug] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables
    const vars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        // Mask the actual values for security
        vars[key] = process.env[key]?.substring(0, 3) + "..." || "undefined"
      }
    })
    setEnvVars(vars)
  }, [])

  return (
    <div className="fixed bottom-4 right-4">
      <button onClick={() => setShowDebug(!showDebug)} className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md text-xs">
        {showDebug ? "Hide Debug" : "Debug Env"}
      </button>

      {showDebug && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-900 border rounded-md shadow-lg max-w-md">
          <h3 className="font-bold mb-2">Environment Variables:</h3>
          <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(envVars, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
