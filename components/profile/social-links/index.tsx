"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { SocialLink, SocialUsernames } from "./types"
import { SocialLinksDisplay } from "./social-links-display"
import { SocialLinksEditDialog } from "./social-links-edit-dialog"
import { buildSocialLinks, extractSocialUsernames } from "./utils"

interface SocialLinksProps {
  socialLinks: SocialLink[]
  userId: string
  onSocialLinksChange: (links: SocialLink[]) => void
}

export function SocialLinks({ socialLinks, userId, onSocialLinksChange }: SocialLinksProps) {
  const { toast } = useToast()
  const [socialDialogOpen, setSocialDialogOpen] = useState(false)
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
    const initialUsernames = extractSocialUsernames(socialLinks)
    setSocialUsernames(initialUsernames)
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
      const newSocialLinks = buildSocialLinks(socialUsernames)
      
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
      <SocialLinksDisplay 
        socialLinks={socialLinks} 
        onEdit={openSocialDialog} 
      />

      <SocialLinksEditDialog 
        open={socialDialogOpen}
        onOpenChange={setSocialDialogOpen}
        socialUsernames={socialUsernames}
        updateSocialUsername={updateSocialUsername}
        updateCustomPlatform={updateCustomPlatform}
        onSave={saveSocialLinks}
        isSaving={isSaving}
      />
    </>
  )
}

// Re-export types for easier imports elsewhere
export * from "./types"