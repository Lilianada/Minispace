"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Type } from "lucide-react"

interface SiteFontProps {
  fontFamily: string
  setFontFamily: (fontFamily: string) => void
  isSubmitting: boolean
  onSave: () => void
}

const fontOptions = [
  { value: "inter", label: "Inter", preview: "Clean and modern sans-serif", className: "font-sans" },
  { value: "montserrat", label: "Montserrat", preview: "Elegant geometric sans-serif", className: "font-sans" },
  { value: "poppins", label: "Poppins", preview: "Friendly geometric sans", className: "font-sans" },
  { value: "satoshi", label: "Satoshi", preview: "Contemporary grotesk", className: "font-sans" },
  { value: "geist", label: "Geist", preview: "Minimalist interface font", className: "font-sans" },
  { value: "playfair", label: "Playfair Display", preview: "Elegant serif with contrast", className: "font-serif" },
  { value: "merriweather", label: "Merriweather", preview: "Classic readable serif", className: "font-serif" },
  { value: "lora", label: "Lora", preview: "Balanced contemporary serif", className: "font-serif" },
  { value: "jetbrains", label: "JetBrains Mono", preview: "Developer-friendly monospace", className: "font-mono" },
  { value: "fira", label: "Fira Code", preview: "Monospace with ligatures", className: "font-mono" },
]

export function SiteFont({
  fontFamily,
  setFontFamily,
  isSubmitting,
  onSave
}: SiteFontProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Type className="mr-2 h-5 w-5" />
          Font Selection
        </CardTitle>
        <CardDescription>Choose a font family for your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={fontFamily} 
          onValueChange={setFontFamily}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {fontOptions.map((font) => (
            <Label
              key={font.value}
              htmlFor={`font-${font.value}`}
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${fontFamily === font.value ? "border-primary" : "border-muted"}`}
            >
              <RadioGroupItem value={font.value} id={`font-${font.value}`} className="sr-only" />
              <div className={`w-full h-16 flex items-center justify-center ${font.className}`}>
                <span className="text-lg">{font.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">{font.preview}</p>
            </Label>
          ))}
        </RadioGroup>

        <div className="mt-6 p-4 border rounded-md">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className={`p-4 bg-muted/30 rounded-md ${fontOptions.find(f => f.value === fontFamily)?.className || 'font-sans'}`}>
            <p className="text-lg mb-2">The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Font'}
        </Button>
      </CardFooter>
    </Card>
  )
}
