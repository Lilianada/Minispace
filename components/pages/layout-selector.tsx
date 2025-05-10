"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Layout } from "lucide-react"

interface LayoutSelectorProps {
  selectedLayout: string
  setSelectedLayout: (layout: string) => void
  onSave: () => void
  isSubmitting: boolean
}

export function LayoutSelector({
  selectedLayout,
  setSelectedLayout,
  onSave,
  isSubmitting
}: LayoutSelectorProps) {
  // Layout options
  const layouts = [
    { 
      value: "classic-columnist", 
      label: "Classic Columnist", 
      description: "Editorial, timeless, focused on reading comfort",
      preview: "/images/layouts/classic-columnist.png" 
    },
    { 
      value: "modern-card-deck", 
      label: "Modern Card Deck", 
      description: "Visual, modular, great for portfolios",
      preview: "/images/layouts/modern-card-deck.png" 
    },
    { 
      value: "minimalist-focus", 
      label: "Minimalist Focus", 
      description: "Ultra-clean, distraction-free reading",
      preview: "/images/layouts/minimalist-focus.png" 
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layout className="h-5 w-5 mr-2" />
          Layout
        </CardTitle>
        <CardDescription>Choose a layout structure for your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedLayout} 
          onValueChange={setSelectedLayout}
          className="grid grid-cols-1 gap-4"
        >
          {layouts.map(layout => (
            <Label
              key={layout.value}
              htmlFor={`layout-${layout.value}`}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                selectedLayout === layout.value ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value={layout.value} id={`layout-${layout.value}`} className="sr-only" />
              <div className="w-full sm:w-1/3 aspect-video rounded-md bg-muted/50 border overflow-hidden">
                <div className="h-full w-full flex flex-col">
                  {layout.value === "classic-columnist" && (
                    <div className="h-full w-full flex flex-col">
                      <div className="h-2 bg-primary/20 border-b"></div>
                      <div className="flex-1 flex">
                        <div className="w-1/4 border-r bg-muted/20"></div>
                        <div className="flex-1 flex items-center justify-center p-2">
                          <div className="w-full h-2 bg-muted/40 mb-1"></div>
                          <div className="w-full h-2 bg-muted/40 mb-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {layout.value === "modern-card-deck" && (
                    <div className="h-full w-full flex flex-col">
                      <div className="h-2 bg-primary/20 border-b"></div>
                      <div className="flex-1 p-2">
                        <div className="grid grid-cols-2 gap-1 h-full">
                          <div className="bg-muted/40 rounded"></div>
                          <div className="bg-muted/40 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {layout.value === "minimalist-focus" && (
                    <div className="h-full w-full flex flex-col">
                      <div className="h-0.5 w-1/3 bg-primary/40"></div>
                      <div className="h-2 border-b"></div>
                      <div className="flex-1 flex items-center justify-center p-2">
                        <div className="w-2/3 mx-auto">
                          <div className="w-full h-2 bg-muted/40 mb-1"></div>
                          <div className="w-full h-2 bg-muted/40 mb-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium mb-1">{layout.label}</div>
                <div className="text-sm text-muted-foreground">{layout.description}</div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Layout'}
        </Button>
      </CardFooter>
    </Card>
  )
}
