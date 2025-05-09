"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Paintbrush } from "lucide-react"

interface ThemeSelectorProps {
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  onSave: () => void
  isSubmitting: boolean
}

export function ThemeSelector({
  selectedTheme,
  setSelectedTheme,
  onSave,
  isSubmitting
}: ThemeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          Theme
        </CardTitle>
        <CardDescription>Choose a theme for your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedTheme} 
          onValueChange={setSelectedTheme}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Label
            htmlFor="theme-default"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "default" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="default" id="theme-default" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-gradient-to-b from-blue-100 to-blue-50 border mb-2"></div>
            <span>Default</span>
          </Label>
          
          <Label
            htmlFor="theme-minimal"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "minimal" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="minimal" id="theme-minimal" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-[#FFFFFF] border mb-2"></div>
            <span>Minimal</span>
          </Label>
          
          <Label
            htmlFor="theme-dark"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "dark" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-[#1F1F1F] border mb-2"></div>
            <span>Dark</span>
          </Label>
          
          <Label
            htmlFor="theme-serif"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "serif" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="serif" id="theme-serif" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-[#F8F5F0] border mb-2 font-serif flex items-center justify-center text-xs">
              <span className="opacity-50">Serif Typography</span>
            </div>
            <span>Serif</span>
          </Label>
          
          <Label
            htmlFor="theme-mono"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "mono" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="mono" id="theme-mono" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-[#F0F0F0] border mb-2 font-mono flex items-center justify-center text-xs">
              <span className="opacity-50">Monospace Type</span>
            </div>
            <span>Monospace</span>
          </Label>
          
          <Label
            htmlFor="theme-colorful"
            className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              selectedTheme === "colorful" ? "border-primary" : "border-muted"
            }`}
          >
            <RadioGroupItem value="colorful" id="theme-colorful" className="sr-only" />
            <div className="w-full h-24 rounded-md bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 border mb-2"></div>
            <span>Colorful</span>
          </Label>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Theme'}
        </Button>
      </CardFooter>
    </Card>
  )
}
