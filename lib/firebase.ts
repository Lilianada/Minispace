import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

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
const isConfigValid = Object.values(firebaseConfig).every(
  (value) => value !== undefined && value !== null && value !== "",
)

// Initialize Firebase
let app
let auth
let db

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  try {
    if (!isConfigValid) {
      console.error(
        "Firebase configuration is incomplete. Check your environment variables:",
        Object.keys(firebaseConfig)
          .filter((key) => !firebaseConfig[key])
          .join(", "),
      )
    } else {
      // Initialize Firebase
      app = initializeApp(firebaseConfig)

      // Initialize Auth with persistence
      auth = getAuth(app)
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error("Error setting auth persistence:", error)
      })

      // Initialize Firestore
      db = getFirestore(app)

      console.log("Firebase initialized successfully")
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
  }
}

export { app, auth, db }
