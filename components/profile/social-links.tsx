"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Edit, Twitter, Instagram, Github, Linkedin, Link2, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define interfaces for social links
export interface SocialLink {
  platform: string
  url: string
  icon: React.ReactNode
  prefix?: string
}

export interface SocialUsernames {
  X: string
  Instagram: string
  LinkedIn: string
  GitHub: string
  Custom: {
    platform: string
    url: string
  }
}

// Define social platforms with their prefixes
export const SOCIAL_PLATFORMS = {
  X: {
    prefix: "https://x.com/",
    icon: <Twitter className="h-4 w-4" />
  },
  Instagram: {
    prefix: "https://instagram.com/",
    icon: <Instagram className="h-4 w-4" />
  },
  LinkedIn: {
    prefix: "https://linkedin.com/in/",
    icon: <Linkedin className="h-4 w-4" />
  },
  GitHub: {
    prefix: "https://github.com/",
    icon: <Github className="h-4 w-4" />
  },
  Custom: {
    prefix: "https://",
    icon: <Link2 className="h-4 w-4" />
  }
}

interface SocialLinksProps {
  socialLinks: SocialLink[]
  userId: string
  onSocialLinksChange: (links: SocialLink[]) => void
}

export function SocialLinks({ socialLinks, userId, onSocialLinksChange }: SocialLinksProps) {
  const { toast } = useToast()
  const [socialDialogOpen, setSocialDialogOpen] = useState(false)
  const [editingSocialLinks, setEditingSocialLinks] = useState<SocialLink[]>([])
  const [isSaving, setIsSaving] = useState(false)
  
  // State for social usernames
  const [socialUsernames, setSocialUsernames] = useState<SocialUsernames>({
    X: "",
    Instagram: "",
    LinkedIn: "",
    GitHub: "",
    Custom: {
      platform: "",
      url: ""
    }
  })
  
  // Open social links edit dialog
  const openSocialDialog = () => {
    // Initialize social usernames from existing links
    const initialUsernames: SocialUsernames = {
      X: "",
      Instagram: "",
      LinkedIn: "",
      GitHub: "",
      Custom: {
        platform: "",
        url: ""
      }
    }
    
    socialLinks.forEach(link => {
      if (link.platform === "X" || link.platform === "Twitter") {
        initialUsernames.X = link.url.replace(SOCIAL_PLATFORMS.X.prefix, "")
      } else if (link.platform === "Instagram") {
        initialUsernames.Instagram = link.url.replace(SOCIAL_PLATFORMS.Instagram.prefix, "")
      } else if (link.platform === "LinkedIn") {
        initialUsernames.LinkedIn = link.url.replace(SOCIAL_PLATFORMS.LinkedIn.prefix, "")
      } else if (link.platform === "GitHub") {
        initialUsernames.GitHub = link.url.replace(SOCIAL_PLATFORMS.GitHub.prefix, "")
      } else {
        initialUsernames.Custom = {
          platform: link.platform,
          url: link.url.replace("https://", "")
        }
      }
    })
    
    setSocialUsernames(initialUsernames)
    setEditingSocialLinks([...socialLinks])
    setSocialDialogOpen(true)
  }
  
  // Update social username
  const updateSocialUsername = (platform: string, username: string) => {
    if (platform === "Custom") {
      setSocialUsernames(prev => ({
        ...prev,
        Custom: { ...prev.Custom, url: username }
      }))
    } else {
      setSocialUsernames(prev => ({
        ...prev,
        [platform]: username
      }))
    }
  }
  
  // Update custom platform name
  const updateCustomPlatform = (name: string) => {
    setSocialUsernames(prev => ({
      ...prev,
      Custom: { ...prev.Custom, platform: name }
    }))
  }
  
  // Save social links changes
  const saveSocialLinks = async () => {
    setIsSaving(true)
    try {
      // Build social links from usernames
      const newSocialLinks: SocialLink[] = []
      
      // Add standard social platforms
      if (socialUsernames.X) {
        newSocialLinks.push({
          platform: "X",
          url: SOCIAL_PLATFORMS.X.prefix + socialUsernames.X,
          icon: SOCIAL_PLATFORMS.X.icon,
          prefix: SOCIAL_PLATFORMS.X.prefix
        })
      }
      
      if (socialUsernames.Instagram) {
        newSocialLinks.push({
          platform: "Instagram",
          url: SOCIAL_PLATFORMS.Instagram.prefix + socialUsernames.Instagram,
          icon: SOCIAL_PLATFORMS.Instagram.icon,
          prefix: SOCIAL_PLATFORMS.Instagram.prefix
        })
      }
      
      if (socialUsernames.LinkedIn) {
        newSocialLinks.push({
          platform: "LinkedIn",
          url: SOCIAL_PLATFORMS.LinkedIn.prefix + socialUsernames.LinkedIn,
          icon: SOCIAL_PLATFORMS.LinkedIn.icon,
          prefix: SOCIAL_PLATFORMS.LinkedIn.prefix
        })
      }
      
      if (socialUsernames.GitHub) {
        newSocialLinks.push({
          platform: "GitHub",
          url: SOCIAL_PLATFORMS.GitHub.prefix + socialUsernames.GitHub,
          icon: SOCIAL_PLATFORMS.GitHub.icon,
          prefix: SOCIAL_PLATFORMS.GitHub.prefix
        })
      }
      
      // Add custom link if both platform and URL are provided
      if (socialUsernames.Custom.platform && socialUsernames.Custom.url) {
        newSocialLinks.push({
          platform: socialUsernames.Custom.platform,
          url: SOCIAL_PLATFORMS.Custom.prefix + socialUsernames.Custom.url,
          icon: SOCIAL_PLATFORMS.Custom.icon,
          prefix: SOCIAL_PLATFORMS.Custom.prefix
        })
      }
      
      // Update parent component with new links
      onSocialLinksChange(newSocialLinks)
      
      toast({
        title: "Social Links Updated",
        description: "Your social links have been updated successfully."
      })
      
      setSocialDialogOpen(false)
    } catch (error) {
      console.error("Error updating social links:", error)
      toast({
        title: "Error",
        description: "Failed to update social links. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Social Links</CardTitle>
            <Button variant="outline" size="sm" onClick={openSocialDialog}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:underline"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                    {link.icon}
                  </div>
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links Dialog */}
      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Links</DialogTitle>
            <DialogDescription>
              Add your social media usernames. We'll automatically add the correct prefixes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Standard social platforms */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Social Platforms</h4>
              
              {/* X (Twitter) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="x-username" className="text-right col-span-1 flex items-center gap-2">
                  <Twitter className="h-4 w-4" /> X
                </Label>
                <div className="col-span-3 flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                    {SOCIAL_PLATFORMS.X.prefix}
                  </div>
                  <Input
                    id="x-username"
                    value={socialUsernames.X}
                    onChange={(e) => updateSocialUsername("X", e.target.value)}
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              {/* Instagram */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instagram-username" className="text-right col-span-1 flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> Instagram
                </Label>
                <div className="col-span-3 flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                    {SOCIAL_PLATFORMS.Instagram.prefix}
                  </div>
                  <Input
                    id="instagram-username"
                    value={socialUsernames.Instagram}
                    onChange={(e) => updateSocialUsername("Instagram", e.target.value)}
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              {/* LinkedIn */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkedin-username" className="text-right col-span-1 flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Label>
                <div className="col-span-3 flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                    {SOCIAL_PLATFORMS.LinkedIn.prefix}
                  </div>
                  <Input
                    id="linkedin-username"
                    value={socialUsernames.LinkedIn}
                    onChange={(e) => updateSocialUsername("LinkedIn", e.target.value)}
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              {/* GitHub */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github-username" className="text-right col-span-1 flex items-center gap-2">
                  <Github className="h-4 w-4" /> GitHub
                </Label>
                <div className="col-span-3 flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                    {SOCIAL_PLATFORMS.GitHub.prefix}
                  </div>
                  <Input
                    id="github-username"
                    value={socialUsernames.GitHub}
                    onChange={(e) => updateSocialUsername("GitHub", e.target.value)}
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Custom link */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Custom Link (Optional)</h4>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-platform" className="text-right col-span-1">
                  Platform
                </Label>
                <div className="col-span-3">
                  <Input
                    id="custom-platform"
                    value={socialUsernames.Custom.platform}
                    onChange={(e) => updateCustomPlatform(e.target.value)}
                    placeholder="e.g. Medium"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-url" className="text-right col-span-1">
                  URL
                </Label>
                <div className="col-span-3 flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                    {SOCIAL_PLATFORMS.Custom.prefix}
                  </div>
                  <Input
                    id="custom-url"
                    value={socialUsernames.Custom.url}
                    onChange={(e) => updateSocialUsername("Custom", e.target.value)}
                    placeholder="example.com/profile"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSocialDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSocialLinks} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
