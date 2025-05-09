"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Paintbrush, Save } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AppearanceSettingsProps {
  theme: string
  setTheme: (theme: string) => void
  isSubmitting: boolean
  onSave: () => void
}

export function AppearanceSettings({
  theme,
  setTheme,
  isSubmitting,
  onSave
}: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          Appearance Settings
        </CardTitle>
        <CardDescription>Customize the look and feel of your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <RadioGroup 
            value={theme} 
            onValueChange={setTheme}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Label
              htmlFor="theme-light"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "light" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-[#FFFFFF] border mb-2"></div>
              <span>Light</span>
            </Label>
            
            <Label
              htmlFor="theme-dark"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "dark" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-[#1F1F1F] border mb-2"></div>
              <span>Dark</span>
            </Label>
            
            <Label
              htmlFor="theme-system"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "system" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="system" id="theme-system" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-gradient-to-r from-[#FFFFFF] to-[#1F1F1F] border mb-2"></div>
              <span>System</span>
            </Label>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Appearance'}
        </Button>
      </CardFooter>
    </Card>
  )
}
