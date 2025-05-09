"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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
            <Card className="w-full h-48 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-3 bg-muted-foreground/30 rounded-full"></div>
                    <div className="w-16 h-3 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded-md p-2 flex flex-col space-y-2">
                      <div className="w-full h-10 bg-muted-foreground/10 rounded"></div>
                      <div className="w-full h-3 bg-muted-foreground/20 rounded-full"></div>
                      <div className="w-3/4 h-3 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-8 h-2 bg-primary/30 rounded-full"></div>
                        <div className="w-8 h-2 bg-primary/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-md p-2 flex flex-col space-y-2">
                      <div className="w-full h-10 bg-muted-foreground/10 rounded"></div>
                      <div className="w-full h-3 bg-muted-foreground/20 rounded-full"></div>
                      <div className="w-3/4 h-3 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-8 h-2 bg-primary/30 rounded-full"></div>
                        <div className="w-8 h-2 bg-primary/30 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Resource Library Layout with cards and category filtering
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
            <Card className="w-full h-48 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-3 bg-muted-foreground/40 rounded-full font-medium"></div>
                    <div className="w-16 h-3 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-16 h-2 bg-muted-foreground/20 rounded-full"></div>
                        <div className="w-1 h-2 bg-muted-foreground/20 rounded-full mx-1"></div>
                        <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-16 h-2 bg-muted-foreground/20 rounded-full"></div>
                        <div className="w-1 h-2 bg-muted-foreground/20 rounded-full mx-1"></div>
                        <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-16 h-2 bg-muted-foreground/20 rounded-full"></div>
                        <div className="w-1 h-2 bg-muted-foreground/20 rounded-full mx-1"></div>
                        <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Chronological Journal Style organized by year and month
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
            <Card className="w-full h-48 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-3 bg-muted-foreground/30 rounded-full"></div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-8 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-8 h-3 bg-primary/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded-md p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                          <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                      </div>
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full mb-1"></div>
                      <div className="w-3/4 h-2 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-6 h-2 bg-primary/30 rounded-full"></div>
                        <div className="w-6 h-2 bg-primary/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-md p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                          <div className="w-10 h-2 bg-muted-foreground/30 rounded-full"></div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                      </div>
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full mb-1"></div>
                      <div className="w-3/4 h-2 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-6 h-2 bg-primary/30 rounded-full"></div>
                        <div className="w-6 h-2 bg-primary/30 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Bookmarks & Discoveries Board with content type filters
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
            <Card className="w-full h-48 overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-3 bg-muted-foreground/40 rounded-full"></div>
                    <div className="w-20 h-3 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  
                  {/* Featured post */}
                  <div className="flex space-x-2 p-2 bg-muted/30 rounded-md">
                    <div className="w-16 h-16 bg-muted-foreground/10 rounded-md"></div>
                    <div className="flex-1 space-y-1">
                      <div className="w-12 h-2 bg-primary/30 rounded-full"></div>
                      <div className="w-full h-3 bg-muted-foreground/30 rounded-full"></div>
                      <div className="w-3/4 h-2 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-12 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Grid of posts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded-md p-1">
                      <div className="w-full h-6 bg-muted-foreground/10 rounded-md mb-1"></div>
                      <div className="w-full h-2 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-8 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-md p-1">
                      <div className="w-full h-6 bg-muted-foreground/10 rounded-md mb-1"></div>
                      <div className="w-full h-2 bg-muted-foreground/20 rounded-full"></div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20"></div>
                        <div className="w-8 h-2 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Magazine style with featured post and article grid
            </p>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
