"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ThemePreviewIframeProps {
  username: string
  selectedTheme: string
  fontFamily: string
  headerText?: string
  footerText?: string
}

export function ThemePreviewIframe({
  username,
  selectedTheme,
  fontFamily,
  headerText,
  footerText
}: ThemePreviewIframeProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [previewUrl, setPreviewUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previewType, setPreviewType] = useState<"home" | "post" | "page">("home")
  
  // Create a preview URL with query parameters for theme settings
  useEffect(() => {
    // In a real implementation, this would be a staging subdomain
    // For now, we'll use a special preview route
    const baseUrl = `/api/preview/${username}`
    
    const params = new URLSearchParams({
      theme: selectedTheme,
      font: fontFamily,
      header: headerText || username,
      footer: footerText || `© ${new Date().getFullYear()} ${username}`,
      type: previewType
    })
    
    setPreviewUrl(`${baseUrl}?${params.toString()}`)
    setIsLoading(true)
  }, [username, selectedTheme, fontFamily, headerText, footerText, previewType])
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }
  
  // Get viewport dimensions based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case "desktop":
        return { width: "100%", height: "500px" }
      case "tablet":
        return { width: "768px", height: "500px" }
      case "mobile":
        return { width: "375px", height: "500px" }
    }
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              Live Theme Preview
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Staging
              </Badge>
            </CardTitle>
            <CardDescription>
              Preview how your site will look with the selected theme and settings
            </CardDescription>
          </div>
          
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
        
        <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as any)} className="mt-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="post">Blog Post</TabsTrigger>
            <TabsTrigger value="page">About Page</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex justify-center bg-background/50 border-t overflow-auto p-4">
          <div 
            className="relative transition-all duration-300 flex items-center justify-center"
            style={getViewportStyle()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Loading preview...</span>
                </div>
              </div>
            )}
            
            <iframe 
              src={previewUrl}
              className="w-full h-full border rounded-md"
              onLoad={handleIframeLoad}
              title="Theme Preview"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 border-t bg-muted/10">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Theme:</span> {selectedTheme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            <span className="mx-2">•</span>
            <span className="font-medium">Font:</span> {fontFamily.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
          
          <Button variant="outline" size="sm" className="text-xs h-7" asChild>
            <a href={`https://${username}.minispace.app`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View Live Site
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
