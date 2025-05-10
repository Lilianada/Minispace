"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { BlogSettings } from "@/components/blog"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogLayoutStyle } from "@/components/blog/blog-layout-selector"
import DashboardShell from "@/components/dashboard/dashboard-shell"

export default function BlogSettingsPage() {
  const params = useParams()
  const username = params.username as string
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<{
    enabled: boolean
    layoutStyle: BlogLayoutStyle
    showSearch: boolean
  }>({
    enabled: false,
    layoutStyle: "stream",
    showSearch: true
  })
  
  useEffect(() => {
    if (user) {
      fetchBlogSettings()
    }
  }, [user])
  
  const fetchBlogSettings = async () => {
    try {
      setLoading(true)
      
      if (!user?.uid) return
      
      const userDoc = await getDoc(doc(db, `Users/${user.uid}`))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        
        if (userData.blogSettings) {
          setSettings({
            enabled: userData.blogSettings.enabled ?? false,
            layoutStyle: userData.blogSettings.layoutStyle ?? "stream",
            showSearch: userData.blogSettings.showSearch ?? true
          })
        }
      }
    } catch (error) {
      console.error("Error fetching blog settings:", error)
      toast({
        title: "Error",
        description: "Failed to load blog settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <DashboardShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Blog Settings</h1>
          <p className="text-muted-foreground">
            Configure how your blog appears to visitors
          </p>
        </header>
        
        <Separator />
        
        <div className="grid gap-6">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading settings...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <BlogSettings 
                userId={user?.uid || ""} 
                initialSettings={settings}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Layout Preview</CardTitle>
                  <CardDescription>
                    See how your selected layout will appear to visitors
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 border-t">
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                      A live preview of your blog with the selected layout will appear here in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
