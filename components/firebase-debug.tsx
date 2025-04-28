"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getApp, getApps } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore"

export function FirebaseDebug() {
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{
    initialized: boolean
    auth: boolean
    firestore: boolean
    envVars: Record<string, string>
    authState: string
    firestoreTest: string
    appConfig: Record<string, any>
  }>({
    initialized: false,
    auth: false,
    firestore: false,
    envVars: {},
    authState: "Unknown",
    firestoreTest: "Not tested",
    appConfig: {},
  })

  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables
    const vars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_FIREBASE_")) {
        // Mask the actual values for security
        const value = process.env[key] || ""
        vars[key] = value
          ? value.length > 6
            ? value.substring(0, 3) + "..." + value.substring(value.length - 3)
            : "[too short to display safely]"
          : "[empty]"
      }
    })

    // Check Firebase initialization
    const apps = getApps()
    const initialized = apps.length > 0

    // Get app config if initialized
    let appConfig = {}
    if (initialized) {
      try {
        const app = getApp()
        appConfig = {
          name: app.name,
          options: {
            apiKey: app.options.apiKey ? "✓ Set" : "✗ Not set",
            authDomain: app.options.authDomain ? "✓ Set" : "✗ Not set",
            projectId: app.options.projectId ? "✓ Set" : "✗ Not set",
            storageBucket: app.options.storageBucket ? "✓ Set" : "✗ Not set",
            messagingSenderId: app.options.messagingSenderId ? "✓ Set" : "✗ Not set",
            appId: app.options.appId ? "✓ Set" : "✗ Not set",
          },
        }
      } catch (error) {
        console.error("Error getting app config:", error)
      }
    }

    // Set initial state
    setDebugInfo((prev) => ({
      ...prev,
      initialized,
      envVars: vars,
      appConfig,
    }))

    if (initialized) {
      // Check Auth
      try {
        const auth = getAuth()
        setDebugInfo((prev) => ({ ...prev, auth: !!auth }))

        // Check auth state
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setDebugInfo((prev) => ({
              ...prev,
              authState: user ? `Authenticated (${user.email})` : "Not authenticated",
            }))
          },
          (error) => {
            setDebugInfo((prev) => ({
              ...prev,
              authState: `Error: ${error.message}`,
            }))
          },
        )

        return () => unsubscribe()
      } catch (error) {
        console.error("Auth debug error:", error)
        setDebugInfo((prev) => ({
          ...prev,
          authState: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }))
      }

      // Check Firestore
      try {
        const db = getFirestore()
        setDebugInfo((prev) => ({ ...prev, firestore: !!db }))

        // Test Firestore connection
        const testFirestore = async () => {
          try {
            // First try to access Users collection
            const usersQuery = query(collection(db, "Users"), limit(1))
            await getDocs(usersQuery)
            setDebugInfo((prev) => ({ ...prev, firestoreTest: "Connection successful" }))
          } catch (userError) {
            console.error("Firestore Users test error:", userError)

            try {
              // If Users fails, try a simple test collection
              const testQuery = query(collection(db, "test"), limit(1))
              await getDocs(testQuery)
              setDebugInfo((prev) => ({
                ...prev,
                firestoreTest: "Connection successful, but Users collection may not exist yet",
              }))
            } catch (testError) {
              console.error("Firestore test collection error:", testError)
              setDebugInfo((prev) => ({
                ...prev,
                firestoreTest: `Error: ${testError instanceof Error ? testError.message : "Unknown error"}`,
              }))
            }
          }
        }

        testFirestore()
      } catch (error) {
        console.error("Firestore debug error:", error)
        setDebugInfo((prev) => ({
          ...prev,
          firestoreTest: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        }))
      }
    }
  }, [])

  const handleReloadFirebase = () => {
    // Force reload the page to reinitialize Firebase
    window.location.reload()
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant={debugInfo.initialized && debugInfo.auth && debugInfo.firestore ? "outline" : "destructive"}
          size="sm"
          onClick={() => setShowDebug(true)}
        >
          Debug Firebase
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Firebase Debug
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              Close
            </Button>
          </CardTitle>
          <CardDescription>Troubleshoot Firebase configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Initialization:</h3>
            <p className={debugInfo.initialized ? "text-green-500" : "text-red-500"}>
              {debugInfo.initialized ? "Firebase initialized" : "Firebase not initialized"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">App Configuration:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(debugInfo.appConfig, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">Auth:</h3>
            <p className={debugInfo.auth ? "text-green-500" : "text-red-500"}>
              {debugInfo.auth ? "Auth initialized" : "Auth not initialized"}
            </p>
            <p>State: {debugInfo.authState}</p>
          </div>

          <div>
            <h3 className="font-semibold">Firestore:</h3>
            <p className={debugInfo.firestore ? "text-green-500" : "text-red-500"}>
              {debugInfo.firestore ? "Firestore initialized" : "Firestore not initialized"}
            </p>
            <p>Test: {debugInfo.firestoreTest}</p>
          </div>

          <div>
            <h3 className="font-semibold">Environment Variables:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(debugInfo.envVars, null, 2)}
            </pre>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={handleReloadFirebase}>
              Reload Firebase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
