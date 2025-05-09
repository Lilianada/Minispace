"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  displayName: string
  bio: string
  customDomain: string
  onSave: (displayName: string, bio: string, customDomain: string) => Promise<void>
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  displayName,
  bio,
  customDomain,
  onSave
}: ProfileEditDialogProps) {
  const { toast } = useToast()
  const [editName, setEditName] = useState(displayName)
  const [editBio, setEditBio] = useState(bio)
  const [editDomain, setEditDomain] = useState(customDomain)
  const [isSaving, setIsSaving] = useState(false)

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditName(displayName)
      setEditBio(bio)
      setEditDomain(customDomain)
    }
    onOpenChange(open)
  }

  // Save profile changes
  const handleSave = async () => {
    if (!editName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a display name.",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      await onSave(editName, editBio, editDomain)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
            <Input
              id="customDomain"
              value={editDomain}
              onChange={(e) => setEditDomain(e.target.value)}
              placeholder="example.com"
            />
            <p className="text-xs text-muted-foreground">
              Enter your domain without http:// or https://
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
