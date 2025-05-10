"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Palette, Type, Sun } from "lucide-react"

interface ThemeSelectorProps {
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  accentColor: string
  setAccentColor: (color: string) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  textColor: string
  setTextColor: (color: string) => void
  onSave: () => void
  isSubmitting: boolean
}

export function ThemeSelector({
  selectedTheme,
  setSelectedTheme,
  accentColor,
  setAccentColor,
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  onSave,
  isSubmitting
}: ThemeSelectorProps) {
  const [activeTab, setActiveTab] = useState("presets")
  
  // Predefined theme presets
  const themePresets = [
    { 
      id: "default", 
      name: "Default", 
      backgroundColor: "#ffffff", 
      textColor: "#000000", 
      accentColor: "#3b82f6",
      preview: "bg-gradient-to-b from-blue-100 to-blue-50"
    },
    { 
      id: "minimal", 
      name: "Minimal", 
      backgroundColor: "#ffffff", 
      textColor: "#333333", 
      accentColor: "#000000",
      preview: "bg-white"
    },
    { 
      id: "dark", 
      name: "Dark", 
      backgroundColor: "#1f1f1f", 
      textColor: "#ffffff", 
      accentColor: "#60a5fa",
      preview: "bg-[#1F1F1F]"
    },
    { 
      id: "serif", 
      name: "Sepia", 
      backgroundColor: "#f8f5f0", 
      textColor: "#3a3a3a", 
      accentColor: "#8b5cf6",
      preview: "bg-[#F8F5F0]"
    },
    { 
      id: "mono", 
      name: "Monochrome", 
      backgroundColor: "#f0f0f0", 
      textColor: "#222222", 
      accentColor: "#525252",
      preview: "bg-[#F0F0F0]"
    },
    { 
      id: "colorful", 
      name: "Colorful", 
      backgroundColor: "#ffffff", 
      textColor: "#333333", 
      accentColor: "#ec4899",
      preview: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"
    },
    { 
      id: "forest", 
      name: "Forest", 
      backgroundColor: "#f8faf7", 
      textColor: "#2d3c2d", 
      accentColor: "#4ade80",
      preview: "bg-gradient-to-b from-green-100 to-green-50"
    },
    { 
      id: "ocean", 
      name: "Ocean", 
      backgroundColor: "#f0f7ff", 
      textColor: "#1e3a5f", 
      accentColor: "#0ea5e9",
      preview: "bg-gradient-to-b from-sky-100 to-blue-50"
    },
    { 
      id: "sunset", 
      name: "Sunset", 
      backgroundColor: "#fff9f5", 
      textColor: "#4a3f35", 
      accentColor: "#f97316",
      preview: "bg-gradient-to-b from-orange-100 to-amber-50"
    }
  ]
  
  // Apply a preset theme
  const applyThemePreset = (presetId: string) => {
    const preset = themePresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedTheme(preset.id)
      setBackgroundColor(preset.backgroundColor)
      setTextColor(preset.textColor)
      setAccentColor(preset.accentColor)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Theme
        </CardTitle>
        <CardDescription>Choose colors and styling for your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4 pt-4">
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={(value) => applyThemePreset(value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {themePresets.map(preset => (
                <Label
                  key={preset.id}
                  htmlFor={`theme-${preset.id}`}
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    selectedTheme === preset.id ? "border-primary" : "border-muted"
                  }`}
                >
                  <RadioGroupItem value={preset.id} id={`theme-${preset.id}`} className="sr-only" />
                  <div className={`w-full h-24 rounded-md border mb-2 ${preset.preview} overflow-hidden`}>
                    {preset.id === "serif" && (
                      <div className="h-full w-full flex items-center justify-center font-serif text-xs">
                        <span className="opacity-50">Serif Typography</span>
                      </div>
                    )}
                    {preset.id === "mono" && (
                      <div className="h-full w-full flex items-center justify-center font-mono text-xs">
                        <span className="opacity-50">Monospace Type</span>
                      </div>
                    )}
                    {(preset.id !== "serif" && preset.id !== "mono") && (
                      <div className="h-full w-full flex flex-col">
                        <div className="h-6 border-b" style={{ backgroundColor: preset.accentColor }}></div>
                        <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: preset.backgroundColor }}>
                          <div className="text-xs" style={{ color: preset.textColor }}>Preview</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span>{preset.name}</span>
                </Label>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="accent-color" className="flex items-center">
                  <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                  Accent Color
                </Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="accent-color" 
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)} 
                    className="w-12 h-8 p-1"
                  />
                  <Input 
                    type="text" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Used for links, buttons, and highlights</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="background-color" className="flex items-center">
                  <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: backgroundColor }}></div>
                  Background Color
                </Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="background-color" 
                    type="color" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)} 
                    className="w-12 h-8 p-1"
                  />
                  <Input 
                    type="text" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Main background color of your site</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-color" className="flex items-center">
                  <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: textColor }}></div>
                  Text Color
                </Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="text-color" 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)} 
                    className="w-12 h-8 p-1"
                  />
                  <Input 
                    type="text" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Main text color of your site</p>
              </div>
            </div>
            
            <div className="rounded-md border p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Preview</h3>
              </div>
              <div 
                className="rounded-md border overflow-hidden"
                style={{ backgroundColor: backgroundColor }}
              >
                <div className="h-6" style={{ backgroundColor: accentColor }}></div>
                <div className="p-4">
                  <div className="font-medium mb-2" style={{ color: textColor }}>Sample Content</div>
                  <div className="text-sm" style={{ color: textColor }}>This is how your text will look with the selected colors.</div>
                  <div className="mt-2">
                    <span 
                      className="text-sm underline"
                      style={{ color: accentColor }}
                    >
                      This is a link
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Theme'}
        </Button>
      </CardFooter>
    </Card>
  )
}
