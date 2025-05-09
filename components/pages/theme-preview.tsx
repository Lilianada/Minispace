"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Monitor, Tablet, Smartphone } from "lucide-react"
import { ClassicColumnistPreview } from "@/components/themes/classic-columnist"
import { ModernCardDeckPreview } from "@/components/themes/modern-card-deck"
import { MinimalistFocusPreview } from "@/components/themes/minimalist-focus"

interface ThemePreviewProps {
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  onSave: () => void
  isSubmitting: boolean
}

const themes = [
  { 
    value: "classic-columnist", 
    label: "Classic Columnist", 
    description: "Editorial, timeless, focused on reading comfort",
    preview: ClassicColumnistPreview
  },
  { 
    value: "modern-card-deck", 
    label: "Modern Card Deck", 
    description: "Visual, modular, great for portfolios",
    preview: ModernCardDeckPreview
  },
  { 
    value: "minimalist-focus", 
    label: "Minimalist Focus", 
    description: "Ultra-clean, distraction-free reading",
    preview: MinimalistFocusPreview
  },
]

export function ThemePreview({
  selectedTheme,
  setSelectedTheme,
  onSave,
  isSubmitting
}: ThemePreviewProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const selectedThemeData = themes.find(t => t.value === selectedTheme) || themes[0]
  const PreviewComponent = selectedThemeData.preview

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          Theme Selection
        </CardTitle>
        <CardDescription>Choose a layout theme for your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedTheme} 
          onValueChange={setSelectedTheme}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {themes.map((theme) => (
            <Label
              key={theme.value}
              htmlFor={`theme-${theme.value}`}
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                selectedTheme === theme.value ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} className="sr-only" />
              <div className="w-full h-32 mb-3">
                <theme.preview />
              </div>
              <div className="text-center">
                <div className="font-medium">{theme.label}</div>
                <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Live Preview</h3>
            <div className="flex items-center space-x-1 bg-background/80 rounded-md p-1">
              <Button 
                variant={viewportSize === "desktop" ? "default" : "ghost"} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewportSize("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewportSize === "tablet" ? "default" : "ghost"} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewportSize("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewportSize === "mobile" ? "default" : "ghost"} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewportSize("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 flex justify-center bg-background/50">
            <div 
              className={`border border-dashed rounded-md overflow-hidden transition-all duration-300 ${
                viewportSize === "desktop" ? "w-full h-[400px]" : 
                viewportSize === "tablet" ? "w-[600px] h-[400px]" : 
                "w-[320px] h-[400px]"
              }`}
            >
              <PreviewComponent />
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 border-t">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
              
              {selectedTheme === "classic-columnist" && (
                <>
                  <TabsContent value="features" className="text-sm space-y-2 mt-2">
                    <p>• Fixed top navbar with slim height</p>
                    <p>• Optional sidebar for categories or TOC</p>
                    <p>• Centered content with optimal reading width</p>
                    <p>• Clean, traditional footer with essential links</p>
                  </TabsContent>
                  <TabsContent value="layout" className="text-sm space-y-2 mt-2">
                    <p>• Single column layout focused on readability</p>
                    <p>• Max-width content area (4xl) for comfortable reading</p>
                    <p>• Generous line height and paragraph spacing</p>
                    <p>• Subtle dividing lines between sections</p>
                  </TabsContent>
                  <TabsContent value="style" className="text-sm space-y-2 mt-2">
                    <p>• Editorial, timeless aesthetic</p>
                    <p>• Works best with serif or neutral sans-serif fonts</p>
                    <p>• Muted color palette with minimal distractions</p>
                    <p>• Occasional drop caps or pull quotes for visual interest</p>
                  </TabsContent>
                </>
              )}
              
              {selectedTheme === "modern-card-deck" && (
                <>
                  <TabsContent value="features" className="text-sm space-y-2 mt-2">
                    <p>• Transparent navbar overlaying hero image</p>
                    <p>• Optional filter sidebar for resource pages</p>
                    <p>• Card-based content display with hover effects</p>
                    <p>• Grid-based footer with about, links, and newsletter</p>
                  </TabsContent>
                  <TabsContent value="layout" className="text-sm space-y-2 mt-2">
                    <p>• Hero section with title and subtitle</p>
                    <p>• Responsive card grid (2-3 columns at 4xl)</p>
                    <p>• Cards with image, title, description, tags, and CTA</p>
                    <p>• Three-column footer with rich content</p>
                  </TabsContent>
                  <TabsContent value="style" className="text-sm space-y-2 mt-2">
                    <p>• Visual, modular aesthetic</p>
                    <p>• Works best with modern sans-serif fonts</p>
                    <p>• Subtle shadows and hover effects</p>
                    <p>• Light backgrounds with clear section separation</p>
                  </TabsContent>
                </>
              )}
              
              {selectedTheme === "minimalist-focus" && (
                <>
                  <TabsContent value="features" className="text-sm space-y-2 mt-2">
                    <p>• Hidden navbar that appears on hover/scroll</p>
                    <p>• Reading progress bar at the top</p>
                    <p>• Back-to-top button appears while scrolling</p>
                    <p>• Footer fades in at the end of content</p>
                  </TabsContent>
                  <TabsContent value="layout" className="text-sm space-y-2 mt-2">
                    <p>• Full-width single column with max-width (4xl)</p>
                    <p>• Generous padding and white space</p>
                    <p>• Extra breathing room for images and quotes</p>
                    <p>• Minimal, essential-only footer</p>
                  </TabsContent>
                  <TabsContent value="style" className="text-sm space-y-2 mt-2">
                    <p>• Ultra-clean, distraction-free aesthetic</p>
                    <p>• Works with any font that prioritizes readability</p>
                    <p>• Large headings and muted colors</p>
                    <p>• Subtle animations for UI elements</p>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-medium">{selectedThemeData.label}</span>
        </div>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Apply Theme'}
        </Button>
      </CardFooter>
    </Card>
  )
}
