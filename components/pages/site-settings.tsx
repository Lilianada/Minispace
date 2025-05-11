"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Layout, Type, Palette, ExternalLink, Eye, Image } from "lucide-react"
import Link from "next/link"
import { LayoutSelector } from "./layout-selector"
import { ThemeSelector } from "./theme-selector"
import { SiteFont } from "./select-siteFont"
import { useToast } from "@/components/ui/use-toast"

interface SiteSettingsProps {
  username: string
  headerText: string
  setHeaderText: (text: string) => void
  footerText: string
  setFooterText: (text: string) => void
  selectedLayout: string
  setSelectedLayout: (layout: string) => void
  fontFamily: string
  setFontFamily: (font: string) => void
  accentColor: string
  setAccentColor: (color: string) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  textColor: string
  setTextColor: (color: string) => void
  onSave: () => void
  isSaving: boolean
}

export function SiteSettings({
  username,
  headerText,
  setHeaderText,
  footerText, // This will now be fixed as "Powered by Minispace"
  setFooterText,
  selectedLayout,
  setSelectedLayout,
  fontFamily,
  setFontFamily,
  accentColor,
  setAccentColor,
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  onSave,
  isSaving
}: SiteSettingsProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [isCreatingPreview, setIsCreatingPreview] = useState(false)
  const [favicon, setFavicon] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Function to handle favicon upload
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Show preview of the image
    const reader = new FileReader()
    reader.onloadend = () => {
      setFavicon(reader.result as string)
    }
    reader.readAsDataURL(file)
    
  }
  
  // Function to create a temporary preview of the site
  const handleCreatePreview = async () => {
    try {
      setIsCreatingPreview(true)
      
      // Create a preview object with all the current settings
      // Note: footerText is always "Powered by Minispace"
      const previewSettings = {
        username,
        headerText,
        footerText: "Powered by Minispace", // Always use this value
        selectedLayout,
        fontFamily,
        accentColor,
        backgroundColor,
        textColor,
      }
      
      // POST to the preview API to get a preview ID
      const response = await fetch('/api/preview/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewSettings),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create preview')
      }
      
      const data = await response.json()
      const { previewId } = data
      
      // Navigate to the preview page
      window.open(`/preview/${username}?id=${previewId}`, '_blank')
    } catch (error) {
      console.error('Error creating preview:', error)
      toast({
        title: "Preview Error",
        description: "Failed to create preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingPreview(false)
    }
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
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
                value="Powered by Minispace"
                disabled
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                All Minispace sites include this footer attribution
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center gap-3">
                <div className="border rounded-md w-12 h-12 flex items-center justify-center">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt="Favicon preview"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="favicon"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={handleFaviconUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image (PNG, JPG, or SVG). It will be converted to favicon.ico
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Layout Selection */}
          <TabsContent value="layout" className="space-y-4 pt-4">
            <LayoutSelector
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
              onSave={onSave}
              isSubmitting={isSaving}
            />
          </TabsContent>
          
          {/* Theme Selection */}
          <TabsContent value="theme" className="space-y-4 pt-4">
            <ThemeSelector
              selectedTheme={selectedLayout} // Using layout as theme ID for now
              setSelectedTheme={setSelectedLayout}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              textColor={textColor}
              setTextColor={setTextColor}
              onSave={onSave}
              isSubmitting={isSaving}
            />
          </TabsContent>
          
          {/* Typography Settings */}
          <TabsContent value="typography" className="space-y-4 pt-4">
            <SiteFont
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              isSubmitting={isSaving}
              onSave={onSave}
            />
          </TabsContent>
        </Tabs>
        
        {/* Preview and Save Buttons */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Review Changes</h3>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreatePreview} 
                disabled={isCreatingPreview}
              >
                <Eye className="mr-2 h-4 w-4" />
                {isCreatingPreview ? 'Loading Preview...' : 'Preview Changes'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`https://${username}.minispace.dev`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Live Site
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Preview your changes before saving them to see how they'll look on your site.
          </p>
        </div>
        
        <Button onClick={onSave} disabled={isSaving} className="w-full mt-6">
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
