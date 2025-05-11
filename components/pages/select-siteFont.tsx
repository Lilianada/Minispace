"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, Check, HeadingIcon, AlignJustify } from "lucide-react"

interface SiteFontProps {
  // Support both single fontFamily and separate header/body font families
  fontFamily?: string;
  setFontFamily?: (fontFamily: string) => void;
  headerFontFamily?: string;
  bodyFontFamily?: string;
  setHeaderFontFamily?: (fontFamily: string) => void;
  setBodyFontFamily?: (fontFamily: string) => void;
  isSubmitting: boolean;
  onSave: () => void;
}

// Font categories with options
const fontCategories = {
  sans: [
    { value: "inter", label: "Inter", preview: "Clean and modern sans-serif", className: "font-inter" },
    { value: "montserrat", label: "Montserrat", preview: "Elegant geometric sans-serif", className: "font-montserrat" },
    { value: "poppins", label: "Poppins", preview: "Friendly geometric sans", className: "font-poppins" },
    { value: "satoshi", label: "Satoshi", preview: "Contemporary grotesk", className: "font-satoshi" },
    { value: "geist", label: "Geist", preview: "Minimalist interface font", className: "font-geist" },
    { value: "system-ui", label: "System UI", preview: "Native system font", className: "font-sans" },
  ],
  serif: [
    { value: "playfair", label: "Playfair Display", preview: "Elegant serif with contrast", className: "font-playfair" },
    { value: "merriweather", label: "Merriweather", preview: "Classic readable serif", className: "font-merriweather" },
    { value: "lora", label: "Lora", preview: "Balanced contemporary serif", className: "font-lora" },
    { value: "garamond", label: "EB Garamond", preview: "Traditional old-style serif", className: "font-garamond" },
    { value: "libre-baskerville", label: "Libre Baskerville", preview: "Web-optimized serif", className: "font-baskerville" },
    { value: "georgia", label: "Georgia", preview: "Classic web serif", className: "font-serif" },
  ],
  mono: [
    { value: "geist-mono", label: "Geist Mono", preview: "Vercel's monospace font", className: "font-geist-mono" },
    { value: "jetbrains", label: "JetBrains Mono", preview: "Developer-friendly monospace", className: "font-jetbrains" },
    { value: "fira", label: "Fira Code", preview: "Monospace with ligatures", className: "font-fira" },
    { value: "source-code", label: "Source Code Pro", preview: "Clean monospace for code", className: "font-source-code" },
    { value: "roboto-mono", label: "Roboto Mono", preview: "Geometric monospace", className: "font-roboto-mono" },
    { value: "space-mono", label: "Space Mono", preview: "Distinctive fixed-width", className: "font-space-mono" },
  ]
}

// Flatten for easier lookup
const allFonts = Object.values(fontCategories).flat()

export function SiteFont({
  fontFamily,
  headerFontFamily: propHeaderFont,
  bodyFontFamily: propBodyFont,
  setFontFamily,
  setHeaderFontFamily: propSetHeaderFont,
  setBodyFontFamily: propSetBodyFont,
  isSubmitting,
  onSave
}: SiteFontProps) {
  // Support both legacy single font and dual font modes
  const headerFontFamily = propHeaderFont || fontFamily || 'inter';
  const bodyFontFamily = propBodyFont || fontFamily || 'inter';
  
  // Create handler functions that work with both APIs
  const handleHeaderFontChange = (value: string) => {
    if (propSetHeaderFont) {
      propSetHeaderFont(value);
    } else if (setFontFamily) {
      setFontFamily(value);
    }
  };
  
  const handleBodyFontChange = (value: string) => {
    if (propSetBodyFont) {
      propSetBodyFont(value);
    } else if (setFontFamily) {
      setFontFamily(value);
    }
  };
  
  const selectedHeaderFont = allFonts.find(f => f.value === headerFontFamily) || allFonts[0];
  const selectedBodyFont = allFonts.find(f => f.value === bodyFontFamily) || allFonts[0];
  
  // Determine which tab should be active based on the selected font
  const getInitialTab = (fontFamily: string) => {
    const font = allFonts.find(f => f.value === fontFamily) || allFonts[0];
    if (font.className.includes("serif")) return "serif";
    if (font.className.includes("mono")) return "mono";
    return "sans";
  }
  
  // State for active tabs in each section
  const [activeHeaderTab, setActiveHeaderTab] = useState(getInitialTab(headerFontFamily))
  const [activeBodyTab, setActiveBodyTab] = useState(getInitialTab(bodyFontFamily))
  
  // Toggle between header and body font selection
  const [fontSection, setFontSection] = useState<"header" | "body">("header")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Type className="mr-2 h-5 w-5" />
          Typography Selection
        </CardTitle>
        <CardDescription>Choose fonts for your headers and body text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={fontSection} onValueChange={(value) => setFontSection(value as "header" | "body")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="header" className="flex items-center gap-2">
              <HeadingIcon className="h-4 w-4" />
              Header Font
            </TabsTrigger>
            <TabsTrigger value="body" className="flex items-center gap-2">
              <AlignJustify className="h-4 w-4" />
              Body Font
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="header" className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Currently selected: <span className="font-medium">{selectedHeaderFont.label}</span>
            </div>
            
            <Tabs value={activeHeaderTab} onValueChange={setActiveHeaderTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sans">Sans-Serif</TabsTrigger>
                <TabsTrigger value="serif">Serif</TabsTrigger>
                <TabsTrigger value="mono">Monospace</TabsTrigger>
              </TabsList>
              
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <RadioGroup 
                    value={headerFontFamily} 
                    onValueChange={handleHeaderFontChange}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {fonts.map((font) => (
                      <Label
                        key={font.value}
                        htmlFor={`header-font-${font.value}`}
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${headerFontFamily === font.value ? "border-primary" : "border-muted"}`}
                      >
                        <RadioGroupItem value={font.value} id={`header-font-${font.value}`} className="sr-only" />
                        <div className="relative w-full">
                          {headerFontFamily === font.value && (
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <div className={`w-full h-16 flex items-center justify-center ${font.className}`}>
                            <span className="text-lg">{font.label}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">{font.preview}</p>
                      </Label>
                    ))}
                  </RadioGroup>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
          
          <TabsContent value="body" className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Currently selected: <span className="font-medium">{selectedBodyFont.label}</span>
            </div>
            
            <Tabs value={activeBodyTab} onValueChange={setActiveBodyTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sans">Sans-Serif</TabsTrigger>
                <TabsTrigger value="serif">Serif</TabsTrigger>
                <TabsTrigger value="mono">Monospace</TabsTrigger>
              </TabsList>
              
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <RadioGroup 
                    value={bodyFontFamily} 
                    onValueChange={handleBodyFontChange}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {fonts.map((font) => (
                      <Label
                        key={font.value}
                        htmlFor={`body-font-${font.value}`}
                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${bodyFontFamily === font.value ? "border-primary" : "border-muted"}`}
                      >
                        <RadioGroupItem value={font.value} id={`body-font-${font.value}`} className="sr-only" />
                        <div className="relative w-full">
                          {bodyFontFamily === font.value && (
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <div className={`w-full h-16 flex items-center justify-center ${font.className}`}>
                            <span className="text-lg">{font.label}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">{font.preview}</p>
                      </Label>
                    ))}
                  </RadioGroup>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>

        <div className="mt-6 border rounded-md overflow-hidden">
          <div className="bg-primary/10 p-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Typography Preview</h3>
            <div className="text-xs text-muted-foreground">
              Headers: <span className="font-medium">{selectedHeaderFont.label}</span> | 
              Body: <span className="font-medium">{selectedBodyFont.label}</span>
            </div>
          </div>
          <div className={`p-5 ${selectedBodyFont.className}`}>
            {/* Blog header */}
            <div className={`mb-6 pb-4 border-b ${selectedHeaderFont.className}`}>
              <h1 className="text-2xl font-semibold mb-1">MINISPACE</h1>
              <p className="text-sm text-muted-foreground">A lightweight blogging platform</p>
            </div>
            
            {/* Blog post preview */}
            <div className="mb-6">
              <h2 className={`text-xl font-medium mb-3 ${selectedHeaderFont.className}`}>Typography in Web Design</h2>
              <p className="mb-3">The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.</p>
              <p className="mb-3">Good typography establishes a strong visual hierarchy, provides a graphic balance to the page, and sets the product's overall tone. Typography should guide and inform users, optimize readability and accessibility, and ensure an excellent user experience.</p>
              <div className="text-sm text-muted-foreground mb-4">May 11, 2025 · 5 min read</div>
            </div>
            
            {/* Font samples */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 bg-muted/30 rounded-md text-xs ${selectedHeaderFont.className}`}>
                <p className="mb-1 font-medium">Header Font Sample:</p>
                <p className="mb-1">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                <p>abcdefghijklmnopqrstuvwxyz 0123456789</p>
              </div>
              <div className={`p-3 bg-muted/30 rounded-md text-xs ${selectedBodyFont.className}`}>
                <p className="mb-1 font-medium">Body Font Sample:</p>
                <p className="mb-1">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                <p>abcdefghijklmnopqrstuvwxyz 0123456789</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="block sm:inline mb-1 sm:mb-0">Headers: <span className="font-medium">{selectedHeaderFont.label}</span></span>
          <span className="hidden sm:inline mx-2">|</span> 
          <span className="block sm:inline">Body: <span className="font-medium">{selectedBodyFont.label}</span></span>
        </div>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Typography'}
        </Button>
      </CardFooter>
    </Card>
  )
}
