"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Layout, Type, Palette } from "lucide-react"
import Link from "next/link"
import { LayoutPreview } from "./layout-preview"
import { LayoutSelector } from "./layout-selector"
import { ThemeSelector } from "./theme-selector"
import { SiteFont } from "./select-siteFont"

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
  footerText,
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
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder={`&copy; ${new Date().getFullYear()} ${username}`}
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed in the footer of your site
              </p>
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
        
        {/* Unified Preview */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Live Preview</h3>
          <LayoutPreview
            username={username}
            selectedLayout={selectedLayout}
            fontFamily={fontFamily}
            headerText={headerText}
            footerText={footerText}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
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
