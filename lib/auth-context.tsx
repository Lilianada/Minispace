"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  saveUserToStorage,
  saveSessionToStorage,
  getUserFromStorage,
  isAuthenticatedFromStorage,
  clearAuthFromStorage,
  extendSession
} from "./auth-storage"

interface AuthContextType {
  user: User | null
  loading: boolean
  loggingOut: boolean
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string; redirect?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirect?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  userData: UserData | null
  checkEmailExists: (email: string) => Promise<boolean>
  isFirebaseInitialized: boolean
}

interface UserData {
  username: string
  email: string
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loggingOut: false,
  signup: async () => ({ success: false }),
  login: async () => ({ success: false }),
  logout: async () => {},
  resetPassword: async () => ({ success: false }),
  userData: null,
  checkEmailExists: async () => false,
  isFirebaseInitialized: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Check if Firebase is initialized
  useEffect(() => {
    const checkFirebase = () => {
      const isInitialized = !!auth && !!db
      setIsFirebaseInitialized(isInitialized)

      if (!isInitialized) {
        console.error("Firebase auth or Firestore is not initialized")
      }

      return isInitialized
    }

    // Check immediately and set up an interval to keep checking
    const isInitialized = checkFirebase()

    if (!isInitialized) {
      // If not initialized, check again in 2 seconds
      const interval = setInterval(() => {
        if (checkFirebase()) {
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [])

  // Initialize state from local storage first to improve performance
  useEffect(() => {
    // Check if we have cached authentication data
    const isAuthenticated = isAuthenticatedFromStorage();
    const storedUser = getUserFromStorage();
    
    if (isAuthenticated && storedUser) {
      // Use cached data first for faster initial render
      setUserData({
        username: storedUser.username,
        email: storedUser.email
      });
      // We'll still verify with Firebase, but the UI can render immediately
    }
    
    // Reduce loading state faster if we have cached data
    if (!auth || isAuthenticated) {
      setLoading(false);
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return () => {}
    }

    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting auth persistence:", error)
    })

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user)

        if (user && db) {
          try {
            // Fetch user data from Firestore
            const userDocRef = doc(db, "Users", user.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData
              setUserData(userData)
              
              // Save to local storage for faster future access
              saveUserToStorage({
                ...userData,
                uid: user.uid
              });
              saveSessionToStorage(true);
              extendSession(24); // Extend session for 24 hours

              // Only show welcome message if this isn't from a cached session
              const storedUser = getUserFromStorage();
              if (!storedUser || (storedUser && Date.now() - storedUser.lastUpdated > 1000 * 60 * 10)) { // Only if last update was more than 10 minutes ago
                // Show welcome message based on time of day
                const hour = new Date().getHours()
                let greeting = "Hello"

                if (hour < 12) greeting = "Good morning"
                else if (hour < 18) greeting = "Good afternoon"
                else greeting = "Good evening"

                toast({
                  title: `${greeting}, ${userData.username}!`,
                  description:
                    hour < 12
                      ? "Start your day with a great read."
                      : hour < 18
                        ? "Take a break with some interesting articles."
                        : "Unwind with some reading or writing.",
                  duration: 5000,
                })
              }
            } else {
              console.warn("User document does not exist for authenticated user")
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
          }
        } else {
          setUserData(null)
        }

        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [toast, isFirebaseInitialized])

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!auth) return false

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email)
      return methods.length > 0
    } catch (error) {
      console.error("Error checking email existence:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, username: string) => {
    if (!auth || !db) {
      return {
        success: false,
        error: "Firebase is not initialized. Please check your configuration.",
      }
    }

    try {
      // Check if username already exists in Users collection
      const usernameRef = doc(db, "usernames", username);
      const usernameDoc = await getDoc(usernameRef);
      
      if (usernameDoc.exists()) {
        return {
          success: false,
          error: "Username already taken. Please choose a different username.",
        };
      }
     
      try {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        try {
          // Get the ID token for server-side authentication
          const idToken = await user.getIdToken()
          
          // Send the ID token to our API to create a session cookie
          console.log('Sending ID token to API for session creation...');
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken, redirect: `/${username}/dashboard` }),
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            console.error('API response error:', data);
            // If session creation fails, delete the user and throw an error
            await user.delete();
            throw new Error(data.error || data.details || 'Failed to create session')
          }
          
          // Only save user data to Firestore if everything else succeeds
          // Save user data to Firestore - use the existing 'Users' collection for MINISPACE
          await setDoc(doc(db, "Users", user.uid), {
            uid: user.uid,
            username,
            email,
            displayName: username,
            createdAt: new Date(),
            updatedAt: new Date(),
            enableBlog: true,
            customDomain: null,
          })
          
          // Reserve the username
          await setDoc(doc(db, "usernames", username), {
            uid: user.uid,
          })
          
          return { success: true, redirect: data.redirect }
        } catch (error) {
          // If anything fails after user creation but before Firestore save,
          // delete the user to ensure consistency
          console.error('Error during signup process:', error);
          await user.delete();
          throw error;
        }
      } catch (error) {
        // This catches errors from createUserWithEmailAndPassword
        console.error('Error creating user:', error);
        throw error;
      }
      
      // This code is no longer needed as we return earlier
    } catch (error) {
      console.error("Signup error:", error)
      let errorMessage = "Failed to create account. Please try again."

      if (error instanceof Error) {
        const errorCode = (error as any).code

        switch (errorCode) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use. Please use a different email."
            break
          case "auth/weak-password":
            errorMessage = "Password is too weak. Please use a stronger password."
            break
          case "auth/invalid-email":
            errorMessage = "Invalid email address. Please check your email."
            break
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection."
            break
          default:
            errorMessage = `Error: ${errorCode || error.message}`
        }
      }

      return { success: false, error: errorMessage }
    }
  }

  const login = async (email: string, password: string) => {
    if (!auth) {
      return {
        success: false,
        error: "Firebase is not initialized. Please check your configuration.",
      }
    }

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Get the ID token for server-side authentication
      const idToken = await userCredential.user.getIdToken()
      
      // Get the user data to determine username for dashboard redirect
      const user = userCredential.user;
      
      // Fetch the user's data from Firestore to get the username
      let username;
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          username = userData.username;
          console.log('Found username from Firestore:', username);
        }
      } catch (error) {
        console.error('Error fetching username from Firestore:', error);
      }
      
      // Fallback to displayName or uid if username not found
      if (!username) {
        username = user.displayName || user.uid;
        console.log('Using fallback username:', username);
      }
      
      // Send the ID token to our API to create a session cookie
      console.log('Sending ID token to API for login session creation...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          redirect: `/${username}/dashboard` 
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error('API login response error:', data);
        throw new Error(data.error || data.details || 'Failed to create session')
      }
      
      console.log('Login session created successfully');
      
      return { success: true, redirect: data.redirect }
    } catch (error) {
      console.error("Login error:", error)
      let errorMessage = "Failed to log in. Please check your credentials."

      if (error instanceof Error) {
        const errorCode = (error as any).code

        switch (errorCode) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Please check your email or sign up."
            break
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again."
            break
          case "auth/invalid-email":
            errorMessage = "Invalid email address. Please check your email."
            break
          case "auth/user-disabled":
            errorMessage = "This account has been disabled. Please contact support."
            break
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection."
            break
          default:
            errorMessage = `Error: ${errorCode || error.message}`
        }
      }

      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase is not initialized")
    }

    try {
      setLoggingOut(true)
      
      // Clear local storage first for immediate UI response
      clearAuthFromStorage()
      
      // Sign out from Firebase Auth
      await signOut(auth)
      
      // Clear the session cookie on the server
      await fetch('/api/auth/login', {
        method: 'DELETE',
      })

      // Reset state
      setUser(null)
      setUserData(null)

      // Wait for 1 second before redirecting (reduced from 2 seconds for better UX)
      setTimeout(() => {
        router.push("/discover")
        setLoggingOut(false)
      }, 1000)
    } catch (error) {
      console.error("Logout error:", error)
      setLoggingOut(false)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth) {
      return {
        success: false,
        error: "Firebase is not initialized. Please check your configuration.",
      }
    }

    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      console.error("Reset password error:", error)
      let errorMessage = "Failed to send reset email. Please try again."

      if (error instanceof Error) {
        const errorCode = (error as any).code

        switch (errorCode) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Please check your email or sign up."
            break
          case "auth/invalid-email":
            errorMessage = "Invalid email address. Please check your email."
            break
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection."
            break
          default:
            errorMessage = `Error: ${errorCode || error.message}`
        }
      }

      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    loggingOut,
    signup,
    login,
    logout,
    resetPassword,
    userData,
    checkEmailExists,
    isFirebaseInitialized,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
