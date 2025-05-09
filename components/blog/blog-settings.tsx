"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { BlogLayoutSelector, BlogLayoutStyle } from "./blog-layout-selector"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface BlogSettingsProps {
  userId: string
  initialSettings: {
    enabled: boolean
    layoutStyle: BlogLayoutStyle
    showSearch: boolean
  }
}

export function BlogSettings({ userId, initialSettings }: BlogSettingsProps) {
  const [settings, setSettings] = useState({
    enabled: initialSettings.enabled,
    layoutStyle: initialSettings.layoutStyle || "stream",
    showSearch: initialSettings.showSearch !== undefined ? initialSettings.showSearch : true,
    isSaving: false
  })
  
  const { toast } = useToast()
  
  const handleSaveSettings = async () => {
    if (!userId) return
    
    try {
      setSettings(prev => ({ ...prev, isSaving: true }))
      
      await updateDoc(doc(db, `Users/${userId}`), {
        blogSettings: {
          enabled: settings.enabled,
          layoutStyle: settings.layoutStyle,
          showSearch: settings.showSearch,
          updatedAt: new Date()
        }
      })
      
      toast({
        title: "Blog settings saved",
        description: "Your blog settings have been updated successfully."
      })
    } catch (error) {
      console.error("Error saving blog settings:", error)
      toast({
        title: "Error",
        description: "Failed to save blog settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSettings(prev => ({ ...prev, isSaving: false }))
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Settings</CardTitle>
        <CardDescription>
          Configure how your blog appears to visitors
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blog-enabled">Enable Blog</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your blog will be visible to visitors
            </p>
          </div>
          <Switch
            id="blog-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
          />
        </div>
        
        {settings.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="search-enabled">Show Search</Label>
                <p className="text-sm text-muted-foreground">
                  Display a search bar on your blog
                </p>
              </div>
              <Switch
                id="search-enabled"
                checked={settings.showSearch}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showSearch: checked }))}
              />
            </div>
            
            <div className="space-y-3 pt-3">
              <BlogLayoutSelector 
                value={settings.layoutStyle} 
                onChange={(value) => setSettings(prev => ({ ...prev, layoutStyle: value }))}
              />
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSaveSettings}
          disabled={settings.isSaving}
        >
          {settings.isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
