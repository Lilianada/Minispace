"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Palette, Check, Info } from "lucide-react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

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
  const [contextualThemes, setContextualThemes] = useState<any[]>([])
  
  // Predefined theme presets - expanded with more options tailored to specific layout types
  const themePresets = [
    { 
      id: "default", 
      name: "Default", 
      backgroundColor: "#ffffff", 
      textColor: "#000000", 
      accentColor: "#3b82f6",
      preview: "bg-gradient-to-b from-blue-100 to-blue-50",
      bestFor: ["portfolio-grid", "personal-blog", "landing-page", "link-in-bio"]
    },
    { 
      id: "minimal", 
      name: "Minimal", 
      backgroundColor: "#ffffff", 
      textColor: "#333333", 
      accentColor: "#000000",
      preview: "bg-white",
      bestFor: ["portfolio-grid", "notes-zettelkasten", "split-intro"]
    },
    { 
      id: "dark", 
      name: "Dark", 
      backgroundColor: "#1f1f1f", 
      textColor: "#ffffff", 
      accentColor: "#60a5fa",
      preview: "bg-[#1F1F1F]",
      bestFor: ["personal-blog", "link-in-bio", "notes-zettelkasten"]
    },
    { 
      id: "sepia", 
      name: "Sepia", 
      backgroundColor: "#f8f5f0", 
      textColor: "#3a3a3a", 
      accentColor: "#8b5cf6",
      preview: "bg-[#F8F5F0]",
      bestFor: ["personal-blog", "notes-zettelkasten"]
    },
    { 
      id: "mono", 
      name: "Monochrome", 
      backgroundColor: "#f0f0f0", 
      textColor: "#222222", 
      accentColor: "#525252",
      preview: "bg-[#F0F0F0]",
      bestFor: ["portfolio-grid", "split-intro"]
    },
    { 
      id: "colorful", 
      name: "Colorful", 
      backgroundColor: "#ffffff", 
      textColor: "#333333", 
      accentColor: "#ec4899",
      preview: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
      bestFor: ["link-in-bio", "landing-page"]
    },
    { 
      id: "forest", 
      name: "Forest", 
      backgroundColor: "#f8faf7", 
      textColor: "#2d3c2d", 
      accentColor: "#4ade80",
      preview: "bg-gradient-to-b from-green-100 to-green-50",
      bestFor: ["personal-blog", "landing-page"]
    },
    { 
      id: "ocean", 
      name: "Ocean", 
      backgroundColor: "#f0f7ff", 
      textColor: "#1e3a5f", 
      accentColor: "#0ea5e9",
      preview: "bg-gradient-to-b from-sky-100 to-blue-50",
      bestFor: ["portfolio-grid", "split-intro"]
    },
    { 
      id: "sunset", 
      name: "Sunset", 
      backgroundColor: "#fff9f5", 
      textColor: "#4a3f35", 
      accentColor: "#f97316",
      preview: "bg-gradient-to-b from-orange-100 to-amber-50",
      bestFor: ["link-in-bio", "landing-page"]
    },
    { 
      id: "night-mode", 
      name: "Night Mode", 
      backgroundColor: "#121212", 
      textColor: "#e0e0e0", 
      accentColor: "#bb86fc",
      preview: "bg-[#121212]",
      bestFor: ["notes-zettelkasten", "personal-blog"]
    },
    { 
      id: "pastel", 
      name: "Pastel", 
      backgroundColor: "#fcfaff", 
      textColor: "#4b5563", 
      accentColor: "#a78bfa",
      preview: "bg-gradient-to-b from-purple-50 to-pink-50",
      bestFor: ["portfolio-grid", "link-in-bio"]
    },
    { 
      id: "brutalist", 
      name: "Brutalist", 
      backgroundColor: "#ffffff", 
      textColor: "#000000", 
      accentColor: "#ff0000",
      preview: "bg-white border-2 border-black",
      bestFor: ["portfolio-grid", "split-intro"]
    }
  ]
  
  // Filter and sort themes that work best with the selected layout
  useEffect(() => {
    // Parse the selected theme to get the layout type
    const layoutType = selectedTheme.split('-').slice(0, -1).join('-');
    
    // Filter themes that work well with this layout type
    let relevantThemes = themePresets.filter(theme => 
      theme.bestFor.includes(layoutType)
    );
    
    // If no specific matches, show all themes
    if (relevantThemes.length === 0) {
      relevantThemes = themePresets;
    }
    
    setContextualThemes(relevantThemes);
  }, [selectedTheme]);
  
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
            <div className="flex items-center mb-4">
              <h3 className="text-sm font-medium flex items-center">
                Recommended Themes
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">These themes work well with your selected layout type.</p>
                  </HoverCardContent>
                </HoverCard>
              </h3>
            </div>
            
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={(value) => applyThemePreset(value)}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {contextualThemes.map(preset => (
                <Label
                  key={preset.id}
                  htmlFor={`theme-${preset.id}`}
                  className={`flex flex-col items-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    selectedTheme === preset.id ? "border-primary" : "border-muted"
                  }`}
                >
                  <RadioGroupItem value={preset.id} id={`theme-${preset.id}`} className="sr-only" />
                  <div className="relative w-full">
                    <div className={`w-full h-24 rounded-md border mb-2 ${preset.preview} overflow-hidden`}>
                      {preset.id === "sepia" && (
                        <div className="h-full w-full flex items-center justify-center font-serif text-xs">
                          <span className="opacity-50">Serif Typography</span>
                        </div>
                      )}
                      {preset.id === "mono" && (
                        <div className="h-full w-full flex items-center justify-center font-mono text-xs">
                          <span className="opacity-50">Monospace Type</span>
                        </div>
                      )}
                      {preset.id === "brutalist" && (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-xs font-mono uppercase">BRUTALIST</span>
                        </div>
                      )}
                      {(preset.id !== "sepia" && preset.id !== "mono" && preset.id !== "brutalist") && (
                        <div className="h-full w-full flex flex-col">
                          <div className="h-6 border-b" style={{ backgroundColor: preset.accentColor }}></div>
                          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: preset.backgroundColor }}>
                            <div className="text-xs" style={{ color: preset.textColor }}>Preview</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {selectedTheme === preset.id && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full text-center">
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.backgroundColor }}></div>
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.accentColor }}></div>
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.textColor }}></div>
                    </div>
                  </div>
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
                  <div 
                    className="mt-3 inline-block px-3 py-1 text-sm rounded"
                    style={{ backgroundColor: accentColor, color: backgroundColor }}
                  >
                    Button
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Apply Theme'}
        </Button>
      </CardFooter>
    </Card>
  )
}
