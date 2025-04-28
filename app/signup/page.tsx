"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  })
  const { signup, checkEmailExists, isFirebaseInitialized } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = async () => {
    let isValid = true
    const newErrors = { username: "", email: "", password: "" }

    // Validate username
    if (!username) {
      newErrors.username = "Username is required"
      isValid = false
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      isValid = false
    } else if (db) {
      // Check if username is unique
      try {
        const usernameQuery = query(collection(db, "Users"), where("username", "==", username))
        const usernameSnapshot = await getDocs(usernameQuery)
        if (!usernameSnapshot.empty) {
          newErrors.username = "This username is already taken"
          isValid = false
        }
      } catch (error) {
        console.error("Error checking username:", error)
        // Don't fail validation if we can't check, we'll handle this later
      }
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    } else {
      // Check if email is unique
      try {
        const emailExists = await checkEmailExists(email)
        if (emailExists) {
          newErrors.email = "This email is already registered"
          isValid = false
        }
      } catch (error) {
        console.error("Error checking email:", error)
        // Don't fail validation if we can't check, we'll handle this later
      }
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFirebaseInitialized) {
      toast({
        title: "Firebase Not Ready",
        description: "Firebase is still initializing. Please try again in a moment.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      setIsLoading(true)

      // Validate form
      const isValid = await validateForm()
      if (!isValid) {
        setIsLoading(false)
        return
      }

      const result = await signup(email, password, username)

      if (result.success) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
          duration: 5000,
        })
        router.push("/articles")
      } else {
        toast({
          title: "Signup Failed",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create your MINI account</CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseInitialized && (
            <Alert className="mb-4">
              <AlertDescription>
                Firebase is initializing. If this message persists, please check your Firebase configuration.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading || !isFirebaseInitialized}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading || !isFirebaseInitialized}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
                disabled={isLoading || !isFirebaseInitialized}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseInitialized}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
