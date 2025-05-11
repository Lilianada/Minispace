"use client"

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Monitor, Tablet, Smartphone, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

// Import appropriate theme components
import { ClassicColumnist } from '@/components/themes/classic-columnist'
import { MinimalistFocus } from '@/components/themes/minimalist-focus'

// Navigation item interface
interface NavigationItem {
  title: string;  // Changed from 'label' to 'title' to match the expected type
  href: string;
}

// Type for preview settings
interface PreviewSettings {
  username: string
  headerText: string
  footerText: string
  selectedLayout: string
  fontFamily: string
  accentColor: string
  backgroundColor: string
  textColor: string
  [key: string]: any
}

// Helper function to capitalize words with proper typing
const capitalizeWords = (str: string): string => {
  return str.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default function PreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const username = params.username as string
  const previewId = searchParams.get('id')
  
  const [settings, setSettings] = useState<PreviewSettings | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  
  useEffect(() => {
    async function fetchPreviewData() {
      try {
        setLoading(true)
        
        // Fetch the preview settings
        if (!previewId) {
          throw new Error('Preview ID not provided')
        }
        
        const previewResponse = await fetch(`/api/preview/settings?id=${previewId}`)
        if (!previewResponse.ok) {
          throw new Error('Preview settings not found or expired')
        }
        
        const previewData = await previewResponse.json()
        const previewSettings = previewData.settings
        
        setSettings(previewSettings)
        
        // Fetch the user data to get other necessary info
        const usersQuery = query(collection(db, 'Users'), where('username', '==', username))
        const userSnapshot = await getDocs(usersQuery)
        
        if (userSnapshot.empty) {
          throw new Error('User not found')
        }
        
        const userData = {
          id: userSnapshot.docs[0].id,
          ...userSnapshot.docs[0].data()
        }
        
        setUserData(userData)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching preview data:', error)
        setError(error.message || 'Failed to load preview')
        setLoading(false)
      }
    }
    
    fetchPreviewData()
  }, [previewId, username])
  
  // Get the viewport style based on the selected viewport size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case "desktop":
        return { width: "100%", height: "600px" }
      case "tablet":
        return { width: "768px", height: "600px" }
      case "mobile":
        return { width: "375px", height: "600px" }
    }
  }
  
  // Render the appropriate theme component based on the layout
  const renderThemeComponent = () => {
    if (!settings) return null
    
    // If a page-specific layout is provided, use it instead of the global theme layout
    const layoutToUse = settings.pageLayout || settings.selectedLayout;
    
    // Display notification if using page-specific layout
    const usingPageLayout = settings.pageLayout && settings.pageLayout !== settings.selectedLayout;

    // Define navigation items with the corrected type
    const navigationItems: NavigationItem[] = [
      { title: 'Home', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'About', href: '#' }
    ];
    
    // Choose the theme component based on the selected layout
    switch (layoutToUse) {
      case 'classic-columnist':
        return (
          <>
            {usingPageLayout && (
              <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 p-2 text-center mb-4">
                Using page-specific layout: {capitalizeWords(settings.pageLayout)}
                <br />
                <span className="text-xs">(Global theme style is still applied)</span>
              </div>
            )}
            <ClassicColumnist
              siteTitle={settings.headerText || username}
              navigation={navigationItems}
              content={
                <div>
                  <h1>Preview with {capitalizeWords(layoutToUse)} Layout</h1>
                  <p>This is a preview of your site with your selected settings. The global theme styles are applied consistently, while individual pages can use different layout structures.</p>
                </div>
              }
              socialLinks={[]}
              footerText={settings.footerText || `© ${new Date().getFullYear()} ${username}`}
              fontFamily={settings.fontFamily || 'inter'}
            />
          </>
        )
      case 'minimalist-focus':
        return (
          <>
            {usingPageLayout && (
              <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 p-2 text-center mb-4">
                Using page-specific layout: {capitalizeWords(settings.pageLayout)}
                <br />
                <span className="text-xs">(Global theme style is still applied)</span>
              </div>
            )}
            <MinimalistFocus
              siteTitle={settings.headerText || username}
              navigation={navigationItems}
              content={
                <div>
                  <h1>Preview with {capitalizeWords(layoutToUse)} Layout</h1>
                  <p>This is a preview of your site with your selected settings. The global theme styles are applied consistently, while individual pages can use different layout structures.</p>
                </div>
              }
              socialLinks={[]}
              footerText={settings.footerText || `© ${new Date().getFullYear()} ${username}`}
              fontFamily={settings.fontFamily || 'inter'}
            />
          </>
        )
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Unknown Theme Layout</h2>
            <p>The selected theme layout "{layoutToUse}" is not available for preview.</p>
          </div>
        )
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Preview Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-6">
          <Link href={`/${username}/dashboard/settings`}>
            <Button>
              Return to Settings
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Preview Mode
            <Badge variant="outline" className="ml-3">
              {username}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            This is a preview of your site with the changes you've made. These changes won't be visible to others until you save them.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back to editing
          </Button>
          
          <Link href={`/${username}/dashboard/settings`}>
            <Button className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Apply Changes
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Preview viewport control */}
      <div className="bg-card border rounded-lg mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-medium">Site Preview</h2>
          
          <div className="flex items-center space-x-1 bg-muted/50 rounded-md p-1">
            <Button 
              variant={viewportSize === "desktop" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewportSize === "tablet" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("tablet")}
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewportSize === "mobile" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Preview content */}
        <div className="p-4 flex justify-center overflow-x-auto">
          <div 
            className="border rounded-md transition-all duration-300 flex items-center justify-center bg-background overflow-hidden"
            style={getViewportStyle()}
          >
            <div className="w-full h-full" style={{
              color: settings?.textColor || '#000000',
              backgroundColor: settings?.backgroundColor || '#ffffff',
            }}>
              {renderThemeComponent()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Preview Settings Summary</h3>
          
          {settings && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Header Text</div>
                <div className="text-sm text-muted-foreground">{settings.headerText || 'Default Header'}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Footer Text</div>
                <div className="text-sm text-muted-foreground">{settings.footerText || `© ${new Date().getFullYear()} ${username}`}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Global Theme</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {settings.selectedLayout?.split('-').join(' ') || 'Default Layout'}
                </div>
              </div>
              
              {settings.pageLayout && (
                <div>
                  <div className="text-sm font-medium">Page Layout</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {settings.pageLayout?.split('-').join(' ')}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium">Font Family</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {settings.fontFamily?.replace('-', ' ') || 'Default Font'}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Colors</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: settings.accentColor}}></div>
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: settings.backgroundColor}}></div>
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: settings.textColor}}></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}