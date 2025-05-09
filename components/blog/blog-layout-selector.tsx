"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export type BlogLayoutStyle = 'curator' | 'stream' | 'gallery' | 'magazine'

interface BlogLayoutSelectorProps {
  value: BlogLayoutStyle
  onChange: (value: BlogLayoutStyle) => void
}

export function BlogLayoutSelector({ value, onChange }: BlogLayoutSelectorProps) {
  const [selectedLayout, setSelectedLayout] = useState<BlogLayoutStyle>(value)

  const handleChange = (newValue: BlogLayoutStyle) => {
    setSelectedLayout(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold">Choose a Blog Layout</h3>
        <p className="text-sm text-muted-foreground">
          Select how your blog posts will be displayed on your site
        </p>
      </div>

      <RadioGroup 
        value={selectedLayout} 
        onValueChange={(value) => handleChange(value as BlogLayoutStyle)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem 
            value="curator" 
            id="curator" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="curator" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-sm font-medium">The Curator's Shelf</span>
              <Check className="h-4 w-4 text-primary hidden peer-data-[state=checked]:block [&:has([data-state=checked])]:block" />
            </div>
            <Card className="w-full h-32 overflow-hidden">
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted rounded-md h-12 flex items-center justify-center">
                    <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md h-12 flex items-center justify-center">
                    <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md h-12 flex items-center justify-center">
                    <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md h-12 flex items-center justify-center">
                    <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Resource Library Layout
            </p>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="stream" 
            id="stream" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="stream" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-sm font-medium">The Thought Stream</span>
              <Check className="h-4 w-4 text-primary hidden peer-data-[state=checked]:block [&:has([data-state=checked])]:block" />
            </div>
            <Card className="w-full h-32 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-28 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Notes & Reflections Timeline
            </p>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="gallery" 
            id="gallery" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="gallery" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-sm font-medium">The Inspiration Gallery</span>
              <Check className="h-4 w-4 text-primary hidden peer-data-[state=checked]:block [&:has([data-state=checked])]:block" />
            </div>
            <Card className="w-full h-32 overflow-hidden">
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted rounded-md p-2">
                    <div className="w-full h-6 bg-muted-foreground/10 rounded mb-1"></div>
                    <div className="w-1/2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="w-full h-6 bg-muted-foreground/10 rounded mb-1"></div>
                    <div className="w-1/2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="w-full h-6 bg-muted-foreground/10 rounded mb-1"></div>
                    <div className="w-1/2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="w-full h-6 bg-muted-foreground/10 rounded mb-1"></div>
                    <div className="w-1/2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Bookmarks & Discoveries Board
            </p>
          </Label>
        </div>

        <div>
          <RadioGroupItem 
            value="magazine" 
            id="magazine" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="magazine" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-sm font-medium">The Mini Magazine</span>
              <Check className="h-4 w-4 text-primary hidden peer-data-[state=checked]:block [&:has([data-state=checked])]:block" />
            </div>
            <Card className="w-full h-32 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20"></div>
                    <div>
                      <div className="w-16 h-2 bg-muted-foreground/30 rounded-full"></div>
                      <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mt-1"></div>
                    </div>
                  </div>
                  <div className="w-full h-12 bg-muted rounded-md"></div>
                  <div className="flex justify-between">
                    <div className="w-16 h-2 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-8 h-2 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Article Feed with Author Highlights
            </p>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
