"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface AccountSettingsProps {
  username: string
  setUsername: (username: string) => void
  email: string
  setEmail: (email: string) => void
  isSubmitting: boolean
  onSave: () => void
}

export function AccountSettings({
  username,
  setUsername,
  email,
  setEmail,
  isSubmitting,
  onSave
}: AccountSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Account Settings
        </CardTitle>
        <CardDescription>Update your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Your username is used for your profile URL: minispace.dev/{username}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Saving...
            </>
          ) : (
            <>Save Changes</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
