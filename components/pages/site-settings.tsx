"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Paintbrush, Save, Layout, Type, Monitor, Tablet, Smartphone } from "lucide-react"
import Link from "next/link"

interface SiteSettingsProps {
  username: string
  headerText: string
  setHeaderText: (text: string) => void
  footerText: string
  setFooterText: (text: string) => void
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  fontFamily: string
  setFontFamily: (font: string) => void
  onSave: () => void
  isSaving: boolean
}

export function SiteSettings({
  username,
  headerText,
  setHeaderText,
  footerText,
  setFooterText,
  selectedTheme,
  setSelectedTheme,
  fontFamily,
  setFontFamily,
  onSave,
  isSaving
}: SiteSettingsProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState("general")

  // Theme options
  const themes = [
    { value: "classic-columnist", label: "Classic Columnist", description: "Editorial, timeless, focused on reading comfort" },
    { value: "modern-card-deck", label: "Modern Card Deck", description: "Visual, modular, great for portfolios" },
    { value: "minimalist-focus", label: "Minimalist Focus", description: "Ultra-clean, distraction-free reading" },
  ]

  // Font categories
  const fontCategories = {
    sans: [
      { value: "inter", label: "Inter" },
      { value: "montserrat", label: "Montserrat" },
      { value: "poppins", label: "Poppins" },
      { value: "satoshi", label: "Satoshi" },
      { value: "geist", label: "Geist" },
    ],
    serif: [
      { value: "playfair", label: "Playfair Display" },
      { value: "merriweather", label: "Merriweather" },
      { value: "lora", label: "Lora" },
      { value: "georgia", label: "Georgia" },
    ],
    mono: [
      { value: "geist-mono", label: "Geist Mono" },
      { value: "jetbrains", label: "JetBrains Mono" },
      { value: "fira", label: "Fira Code" },
      { value: "source-code", label: "Source Code Pro" },
    ],
  }

  // All fonts flattened for lookup
  const allFonts = Object.values(fontCategories).flat()
  const selectedFont = allFonts.find(f => f.value === fontFamily) || allFonts[0]
  const selectedThemeData = themes.find(t => t.value === selectedTheme) || themes[0]

  // Get font category for tab selection
  const getFontCategory = () => {
    if (!fontFamily) return "sans" // Default to sans if fontFamily is undefined
    if (fontFamily.includes("serif") || ["playfair", "merriweather", "lora", "georgia"].includes(fontFamily)) return "serif"
    if (fontFamily.includes("mono") || ["geist-mono", "jetbrains", "fira", "source-code"].includes(fontFamily)) return "mono"
    return "sans"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layout className="mr-2 h-5 w-5" />
          Site Settings
        </CardTitle>
        <CardDescription>
          Configure your site appearance and content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="header-text">Header Text</Label>
              <Input
                id="header-text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Your site name"
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed in the header of your site
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footer-text">Footer Text</Label>
              <Input
                id="footer-text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder={`© ${new Date().getFullYear()} ${username}`}
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed in the footer of your site
              </p>
            </div>
          </TabsContent>
          
          {/* Theme Selection */}
          <TabsContent value="theme" className="space-y-4 pt-4">
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={setSelectedTheme}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {themes.map((theme) => (
                <Label
                  key={theme.value}
                  htmlFor={`theme-${theme.value}`}
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${selectedTheme === theme.value ? "border-primary" : "border-muted"}`}
                >
                  <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} className="sr-only" />
                  <div className="w-full h-32 mb-3 border rounded-md overflow-hidden bg-muted/20">
                    {/* Theme preview placeholder */}
                    <div className="h-full w-full flex items-center justify-center">
                      {theme.value === "classic-columnist" && (
                        <div className="w-full h-full flex flex-col">
                          <div className="h-6 border-b flex items-center px-2">
                            <div className="w-16 h-3 bg-primary/20 rounded-sm"></div>
                            <div className="flex-1 flex justify-center">
                              <div className="flex space-x-2">
                                <div className="w-8 h-2 bg-primary/20 rounded-sm"></div>
                                <div className="w-8 h-2 bg-primary/20 rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 flex p-2">
                            <div className="w-1/4 pr-2 border-r">
                              <div className="w-full h-3 bg-primary/20 rounded-sm mb-1"></div>
                              <div className="w-full h-2 bg-primary/10 rounded-sm"></div>
                            </div>
                            <div className="flex-1 pl-2">
                              <div className="w-3/4 h-3 bg-primary/20 rounded-sm mb-1"></div>
                              <div className="w-full h-2 bg-primary/10 rounded-sm mb-1"></div>
                              <div className="w-full h-2 bg-primary/10 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {theme.value === "modern-card-deck" && (
                        <div className="w-full h-full flex flex-col">
                          <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/10"></div>
                          <div className="flex-1 p-2">
                            <div className="grid grid-cols-2 gap-1 h-full">
                              <div className="border rounded-sm p-1">
                                <div className="w-full h-1/3 bg-primary/10 mb-1"></div>
                                <div className="w-full h-2 bg-primary/20 rounded-sm mb-1"></div>
                                <div className="w-3/4 h-1 bg-primary/10 rounded-sm"></div>
                              </div>
                              <div className="border rounded-sm p-1">
                                <div className="w-full h-1/3 bg-primary/10 mb-1"></div>
                                <div className="w-full h-2 bg-primary/20 rounded-sm mb-1"></div>
                                <div className="w-3/4 h-1 bg-primary/10 rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {theme.value === "minimalist-focus" && (
                        <div className="w-full h-full flex flex-col">
                          <div className="h-1 w-1/3 bg-primary/40"></div>
                          <div className="flex-1 flex items-center justify-center p-2">
                            <div className="w-2/3 space-y-1">
                              <div className="w-full h-3 bg-primary/20 rounded-sm"></div>
                              <div className="w-full h-2 bg-primary/10 rounded-sm"></div>
                              <div className="w-full h-2 bg-primary/10 rounded-sm"></div>
                              <div className="w-3/4 h-2 bg-primary/10 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{theme.label}</div>
                    <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </TabsContent>
          
          {/* Typography Selection */}
          <TabsContent value="typography" className="space-y-4 pt-4">
            <Tabs defaultValue={getFontCategory()} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sans">Sans-Serif</TabsTrigger>
                <TabsTrigger value="serif">Serif</TabsTrigger>
                <TabsTrigger value="mono">Monospace</TabsTrigger>
              </TabsList>
              
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <RadioGroup 
                    value={fontFamily} 
                    onValueChange={setFontFamily}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {fonts.map((font) => (
                      <Label
                        key={font.value}
                        htmlFor={`font-${font.value}`}
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer ${fontFamily === font.value ? "border-primary" : "border-muted"}`}
                      >
                        <RadioGroupItem value={font.value} id={`font-${font.value}`} className="sr-only" />
                        <div className={`w-full h-12 flex items-center justify-center font-${font.value}`}>
                          <span className="text-base">{font.label}</span>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
        
        {/* Unified Preview */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Live Preview</h3>
            <div className="flex items-center space-x-1 bg-background/80 rounded-md p-1">
              <Button 
                variant={viewportSize === "desktop" ? "default" : "ghost"} 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setViewportSize("desktop")}
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant={viewportSize === "tablet" ? "default" : "ghost"} 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setViewportSize("tablet")}
              >
                <Tablet className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant={viewportSize === "mobile" ? "default" : "ghost"} 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setViewportSize("mobile")}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 flex justify-center bg-background/50">
            <div 
              className={`border border-dashed rounded-md overflow-hidden transition-all duration-300 ${
                viewportSize === "desktop" ? "w-full h-[300px]" : 
                viewportSize === "tablet" ? "w-[500px] h-[300px]" : 
                "w-[320px] h-[300px]"
              }`}
            >
              {/* Unified preview based on selected theme and font */}
              <div className={`w-full h-full flex flex-col font-${fontFamily}`}>
                {selectedTheme === "classic-columnist" && (
                  <>
                    <div className="h-10 border-b bg-background flex items-center px-4">
                      <div className="font-medium">{headerText || username}</div>
                      <div className="flex-1 flex justify-center">
                        <div className="hidden md:flex space-x-4">
                          <div className="text-sm">Blog</div>
                          <div className="text-sm">About</div>
                          <div className="text-sm">Contact</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex p-4 overflow-hidden">
                      <div className="hidden md:block w-1/4 pr-4">
                        <div className="font-medium mb-2">Categories</div>
                        <div className="text-sm text-muted-foreground mb-1">Technology</div>
                        <div className="text-sm text-muted-foreground mb-1">Travel</div>
                        <div className="text-sm text-muted-foreground">Lifestyle</div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="prose prose-sm max-w-none">
                          <h1>Welcome to my blog</h1>
                          <p className="line-clamp-3">This is a preview of your site with the Classic Columnist theme. The content is centered with an optional sidebar for categories or table of contents.</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-8 border-t bg-muted/20 flex items-center justify-center px-4 text-xs text-muted-foreground">
                      {footerText || `© ${new Date().getFullYear()} ${username}`}
                    </div>
                  </>
                )}
                
                {selectedTheme === "modern-card-deck" && (
                  <>
                    <div className="h-12 bg-gradient-to-r from-primary/20 to-primary/10 relative flex items-center px-4">
                      <div className="font-medium text-foreground/90">{headerText || username}</div>
                      <div className="flex-1"></div>
                      <div className="hidden md:flex space-x-4">
                        <div className="text-sm text-foreground/90">Projects</div>
                        <div className="text-sm text-foreground/90">Gallery</div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="border rounded-md overflow-hidden h-32">
                            <div className="h-1/2 bg-primary/10"></div>
                            <div className="p-2">
                              <div className="font-medium text-sm mb-1">Card Title {i}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">This is a preview of the Modern Card Deck theme with a responsive grid layout.</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-10 border-t bg-muted/20 flex items-center justify-center px-4 text-xs text-muted-foreground">
                      {footerText || `© ${new Date().getFullYear()} ${username}`}
                    </div>
                  </>
                )}
                
                {selectedTheme === "minimalist-focus" && (
                  <>
                    <div className="h-1 w-1/3 bg-primary/40"></div>
                    <div className="h-10 flex items-center justify-between px-4">
                      <div className="font-medium text-sm">{headerText || username}</div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center border">
                        <div className="w-3 h-0.5 bg-foreground/70"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                      <div className="prose prose-sm max-w-md mx-auto">
                        <h1 className="text-xl mb-3">Distraction-free reading</h1>
                        <p className="text-sm line-clamp-4">This is a preview of the Minimalist Focus theme. It features a clean, distraction-free layout with a reading progress bar at the top. The navigation is hidden by default and appears on hover or scroll.</p>
                      </div>
                    </div>
                    <div className="h-8 border-t flex items-center justify-between px-4">
                      <div className="text-xs text-muted-foreground">
                        {footerText || `© ${new Date().getFullYear()} ${username}`}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={onSave} disabled={isSaving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Site Settings'}
        </Button>
      </CardContent>
      <CardFooter className="border-t py-3">
        <p className="text-xs text-muted-foreground">
          To add social links to your footer, visit your <Link href={`/${username}/dashboard/profile`} className="underline">profile settings</Link>.
        </p>
      </CardFooter>
    </Card>
  )
}
