"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Layout, Grid, BookOpen, RocketIcon, PanelLeftIcon, FileText, Link2Icon } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

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
  const { toast } = useToast();
  const [localLayout, setLocalLayout] = useState(selectedLayout);
  
  // Function to handle applying layout changes
  const handleApplyLayout = () => {
    setSelectedLayout(localLayout);
    onSave();
    
    // Show toast notification
    toast({
      title: "Layout applied",
      description: "Your layout changes have been saved.",
      duration: 3000
    });
  };

  // Layout options with new naming scheme
  const layouts = [
    { 
      value: "portfolio-grid", 
      label: "Portfolio Grid", 
      description: "Visual layout displaying projects in a responsive grid",
      icon: Grid,
      useCase: "For designers, developers, and creatives to showcase their work",
      blocks: ["Hero section", "Project grid", "About section", "Contact or CTA"]
    },
    { 
      value: "personal-blog", 
      label: "Personal Blog", 
      description: "Single-column layout focused on readability and writing",
      icon: BookOpen,
      useCase: "Writers, developers sharing posts, thoughts, or essays",
      blocks: ["Hero section", "Blog feed", "Post detail", "Footer"]
    },
    { 
      value: "landing-page", 
      label: "Landing Page", 
      description: "Stacked sections to introduce a person, product, or idea",
      icon: RocketIcon,
      useCase: "Product creators, indie hackers promoting something",
      blocks: ["Hero section", "Features or highlights", "About section", "Testimonials", "CTA section"]
    },
    { 
      value: "split-intro", 
      label: "Split Intro", 
      description: "Two-column layout with image on one side, text on the other",
      icon: PanelLeftIcon,
      useCase: "Great for personal intros, artist pages, or minimalist profiles",
      blocks: ["Profile image", "Bio or description", "Navigation/links", "Footer/social media"]
    },
    { 
      value: "notes-zettelkasten", 
      label: "Notes / Zettelkasten", 
      description: "Connected thoughts in a minimal note-taking format",
      icon: FileText,
      useCase: "Writers, thinkers publishing knowledge or digital garden",
      blocks: ["Intro/hero", "Note list", "Note detail", "Backlinks", "Tags/categories"]
    },
    { 
      value: "link-in-bio", 
      label: "Link-in-Bio Page", 
      description: "Compact layout with buttons linking to other sites",
      icon: Link2Icon,
      useCase: "Creators needing a simple profile page for social media",
      blocks: ["Profile image", "Name/description", "Link list", "Footer"]
    }
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
          value={localLayout} 
          onValueChange={setLocalLayout}
          className="grid grid-cols-1 gap-4"
        >
          {layouts.map(layout => (
            <div
              key={layout.value}
              className={`rounded-md border-2 ${
                localLayout === layout.value ? "border-primary" : "border-muted hover:border-primary/50"
              }`}
            >
              <Label
                htmlFor={`layout-${layout.value}`}
                className="cursor-pointer"
              >
                <RadioGroupItem value={layout.value} id={`layout-${layout.value}`} className="sr-only" />
                
                <div className="p-4">
                  {/* Layout Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md bg-primary/10 text-primary`}>
                        <layout.icon className="h-4 w-4" />
                      </div>
                      <div className="font-medium">{layout.label}</div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {localLayout === layout.value ? "Selected" : "Select"}
                    </Badge>
                  </div>

                  {/* Layout Preview and Details in 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                    {/* Left: Visual Preview */}
                    <div className="col-span-1 md:col-span-2 rounded-md bg-muted/50 border aspect-[4/3] overflow-hidden">
                      <div className="h-full w-full flex flex-col">
                        {layout.value === "portfolio-grid" && (
                          <div className="h-full w-full flex flex-col p-2">
                            {/* Header bar */}
                            <div className="h-2 w-full mb-2 bg-primary/30 rounded-sm"></div>
                            
                            {/* Hero */}
                            <div className="h-4 w-full mb-3 bg-muted/60 rounded-sm"></div>
                            
                            {/* Grid of projects */}
                            <div className="grid grid-cols-2 gap-1 flex-1">
                              <div className="rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <div className="w-2/3 h-1/2 bg-primary/20 rounded-sm"></div>
                              </div>
                              <div className="rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <div className="w-2/3 h-1/2 bg-primary/20 rounded-sm"></div>
                              </div>
                              <div className="rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <div className="w-2/3 h-1/2 bg-primary/20 rounded-sm"></div>
                              </div>
                              <div className="rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <div className="w-2/3 h-1/2 bg-primary/20 rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {layout.value === "personal-blog" && (
                          <div className="h-full w-full flex flex-col p-2">
                            {/* Header */}
                            <div className="h-2 w-full bg-primary/30 mb-2 rounded-sm"></div>
                            
                            {/* Hero/Intro */}
                            <div className="flex items-center gap-1 mb-2">
                              <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                              <div className="h-2 flex-1 bg-muted/60 rounded-sm"></div>
                            </div>
                            
                            {/* Blog posts */}
                            <div className="space-y-2 flex-1">
                              <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                              <div className="h-3 w-2/3 bg-primary/20 rounded-sm"></div>
                              <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                              <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                              <div className="h-3 w-2/3 bg-primary/20 rounded-sm mb-1"></div>
                              <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                            </div>
                          </div>
                        )}
                        
                        {layout.value === "landing-page" && (
                          <div className="h-full w-full flex flex-col p-2">
                            {/* Header */}
                            <div className="h-1.5 w-full bg-primary/30 mb-2 rounded-sm"></div>
                            
                            {/* Hero */}
                            <div className="h-5 mb-3 flex flex-col justify-center">
                              <div className="h-2 w-full bg-primary/30 mb-1 rounded-sm"></div>
                              <div className="h-1.5 w-2/3 bg-muted/60 rounded-sm"></div>
                            </div>
                            
                            {/* Features Grid */}
                            <div className="grid grid-cols-3 gap-1 mb-2">
                              <div className="h-3 rounded-sm bg-muted/40"></div>
                              <div className="h-3 rounded-sm bg-muted/40"></div>
                              <div className="h-3 rounded-sm bg-muted/40"></div>
                            </div>
                            
                            {/* About Section */}
                            <div className="h-4 flex-1 rounded-sm bg-primary/10 flex items-center justify-center">
                              <div className="w-2/3 h-1/2 bg-primary/20 rounded-sm"></div>
                            </div>
                            
                            {/* CTA */}
                            <div className="h-2 w-1/3 bg-primary/30 mt-1 mx-auto rounded-sm"></div>
                          </div>
                        )}
                        
                        {layout.value === "split-intro" && (
                          <div className="h-full w-full flex flex-col">
                            {/* Split content */}
                            <div className="flex h-full">
                              {/* Left column - image */}
                              <div className="w-1/2 bg-primary/10 flex items-center justify-center">
                                <div className="w-2/3 aspect-square rounded-full bg-primary/30"></div>
                              </div>
                              
                              {/* Right column - content */}
                              <div className="w-1/2 p-2 flex flex-col justify-center">
                                <div className="h-2 w-full bg-muted/60 mb-1 rounded-sm"></div>
                                <div className="h-2 w-full bg-muted/60 mb-1 rounded-sm"></div>
                                <div className="h-2 w-2/3 bg-muted/60 mb-2 rounded-sm"></div>
                                <div className="h-1.5 w-1/2 bg-primary/30 rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {layout.value === "notes-zettelkasten" && (
                          <div className="h-full w-full flex flex-col p-2">
                            {/* Header */}
                            <div className="h-1.5 w-full bg-primary/30 mb-2 rounded-sm"></div>
                            
                            {/* Content area with sidebar */}
                            <div className="flex flex-1 gap-1">
                              {/* Left sidebar */}
                              <div className="w-1/3 flex flex-col gap-1">
                                <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                                <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                                <div className="h-2 w-full bg-primary/20 rounded-sm"></div>
                                <div className="h-2 w-full bg-muted/60 rounded-sm"></div>
                              </div>
                              
                              {/* Main content */}
                              <div className="flex-1 p-1 border border-dashed border-muted rounded-sm">
                                <div className="h-2 w-2/3 bg-primary/30 mb-1 rounded-sm"></div>
                                <div className="space-y-1">
                                  <div className="h-1.5 w-full bg-muted/60 rounded-sm"></div>
                                  <div className="h-1.5 w-full bg-muted/60 rounded-sm"></div>
                                  <div className="h-1.5 w-full bg-muted/60 rounded-sm"></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex gap-1 mt-1">
                              <div className="h-1.5 w-8 bg-primary/20 rounded-full"></div>
                              <div className="h-1.5 w-6 bg-primary/20 rounded-full"></div>
                              <div className="h-1.5 w-7 bg-primary/20 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        
                        {layout.value === "link-in-bio" && (
                          <div className="h-full w-full flex flex-col p-2 items-center">
                            {/* Profile image */}
                            <div className="w-8 h-8 rounded-full bg-primary/30 my-2"></div>
                            
                            {/* Name */}
                            <div className="h-2 w-1/2 bg-muted/60 mb-2 rounded-sm"></div>
                            
                            {/* Links list */}
                            <div className="w-full space-y-1.5">
                              <div className="h-3 w-full bg-primary/20 rounded-md"></div>
                              <div className="h-3 w-full bg-primary/20 rounded-md"></div>
                              <div className="h-3 w-full bg-primary/20 rounded-md"></div>
                              <div className="h-3 w-full bg-primary/20 rounded-md"></div>
                            </div>
                            
                            {/* Footer */}
                            <div className="flex gap-1 mt-auto">
                              <div className="w-2 h-2 rounded-full bg-muted/60"></div>
                              <div className="w-2 h-2 rounded-full bg-muted/60"></div>
                              <div className="w-2 h-2 rounded-full bg-muted/60"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right: Layout Details */}
                    <div className="col-span-1 md:col-span-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{layout.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Best For</h4>
                        <p className="text-sm text-muted-foreground">{layout.useCase}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Content Blocks</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {layout.blocks.map((block, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {block}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleApplyLayout} 
          disabled={isSubmitting || localLayout === selectedLayout} 
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Apply Layout'}
        </Button>
      </CardFooter>
    </Card>
  )
}
