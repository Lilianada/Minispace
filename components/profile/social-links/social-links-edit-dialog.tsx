import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { SOCIAL_PLATFORMS, SocialUsernames } from "./types"
import { SocialPlatformInput } from "./social-platform-input"
import { CustomLinkInput } from "./custom-link-input"

interface SocialLinksEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  socialUsernames: SocialUsernames
  updateSocialUsername: (platform: string, username: string) => void
  updateCustomPlatform: (name: string) => void
  onSave: () => void
  isSaving: boolean
}

export const SocialLinksEditDialog = ({
  open,
  onOpenChange,
  socialUsernames,
  updateSocialUsername,
  updateCustomPlatform,
  onSave,
  isSaving
}: SocialLinksEditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            
            <SocialPlatformInput 
              platform="X" 
              icon={SOCIAL_PLATFORMS.X.icon}
              prefix={SOCIAL_PLATFORMS.X.prefix}
              value={socialUsernames.X}
              onChange={(value) => updateSocialUsername("X", value)}
            />
            
            <SocialPlatformInput 
              platform="Instagram" 
              icon={SOCIAL_PLATFORMS.Instagram.icon}
              prefix={SOCIAL_PLATFORMS.Instagram.prefix}
              value={socialUsernames.Instagram}
              onChange={(value) => updateSocialUsername("Instagram", value)}
            />
            
            <SocialPlatformInput 
              platform="LinkedIn" 
              icon={SOCIAL_PLATFORMS.LinkedIn.icon}
              prefix={SOCIAL_PLATFORMS.LinkedIn.prefix}
              value={socialUsernames.LinkedIn}
              onChange={(value) => updateSocialUsername("LinkedIn", value)}
            />
            
            <SocialPlatformInput 
              platform="GitHub" 
              icon={SOCIAL_PLATFORMS.GitHub.icon}
              prefix={SOCIAL_PLATFORMS.GitHub.prefix}
              value={socialUsernames.GitHub}
              onChange={(value) => updateSocialUsername("GitHub", value)}
            />
          </div>
          
          <Separator />
          
          {/* Custom link */}
          <CustomLinkInput 
            platformName={socialUsernames.Custom.platform}
            url={socialUsernames.Custom.url}
            onChangePlatform={updateCustomPlatform}
            onChangeUrl={(value) => updateSocialUsername("Custom", value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}