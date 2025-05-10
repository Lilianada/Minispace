"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Share2, Copy, Check, Calendar } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface ProfileHeaderProps {
  username: string
  displayName: string
  bio: string
  customDomain?: string
  joinDate: Date | null
  onEditProfile: () => void
  onShareProfile: () => void
}

export function ProfileHeader({
  username,
  displayName,
  bio,
  customDomain,
  joinDate,
  onEditProfile,
  onShareProfile
}: ProfileHeaderProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef<NodeJS.Timeout | null>(null)

  // Copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    
    // Clear the copied state after 2 seconds
    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current)
    }
    
    copyTimeout.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
    
    toast({
      title: "URL Copied",
      description: "The URL has been copied to your clipboard"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="text-lg font-medium">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onEditProfile}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm" onClick={onShareProfile}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Member since {joinDate ? format(joinDate, 'MMMM yyyy') : 'N/A'}
        </div>
        
        <p className="text-sm max-w-2xl">{bio}</p>
        
        <div className="flex items-center space-x-1 text-sm">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{username}</span>.minispace.dev
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => copyToClipboard(`https://${username}.minispace.dev`)}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {customDomain && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Custom domain:</span>
            <a 
              href={`https://${customDomain}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              {customDomain}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
