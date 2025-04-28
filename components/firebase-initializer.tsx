"use client"

import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

// This component ensures Firebase is initialized properly
export function FirebaseInitializer() {
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initializeFirebase = () => {
      try {
        // Firebase configuration
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        // Check if all required config values are present
        const missingKeys = Object.entries(firebaseConfig)
          .filter(([_, value]) => !value)
          .map(([key]) => key)

        if (missingKeys.length > 0) {
          console.error("Missing Firebase configuration keys:", missingKeys.join(", "))
          toast({
            title: "Firebase Configuration Error",
            description: `Missing Firebase configuration: ${missingKeys.join(", ")}`,
            variant: "destructive",
            duration: 10000,
          })
          return false
        }

        // Initialize Firebase
        const app = initializeApp(firebaseConfig)

        // Initialize Auth with persistence
        const auth = getAuth(app)
        setPersistence(auth, browserLocalPersistence).catch((error) => {
          console.error("Error setting auth persistence:", error)
        })

        // Initialize Firestore
        const db = getFirestore(app)

        console.log("Firebase initialized successfully by initializer component")
        return true
      } catch (error) {
        console.error("Error initializing Firebase:", error)
        toast({
          title: "Firebase Initialization Error",
          description: error instanceof Error ? error.message : "Failed to initialize Firebase",
          variant: "destructive",
          duration: 10000,
        })
        return false
      }
    }

    // Only initialize on client side
    if (typeof window !== "undefined") {
      const success = initializeFirebase()
      setInitialized(success)
    }
  }, [toast])

  return null // This component doesn't render anything
}
