import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { SocialLink } from "./types"
import { SocialLinkItem } from "./social-link-item"

interface SocialLinksDisplayProps {
  socialLinks: SocialLink[]
  onEdit: () => void
}

export const SocialLinksDisplay = ({ socialLinks, onEdit }: SocialLinksDisplayProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Social Profiles</CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1">
            <Plus className="h-4 w-4" />
            Add new
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your social media accounts to your MINISPACE.
        </p>
      </CardHeader>
      <CardContent>
        {socialLinks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No social links added yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="mt-4"
            >
              Connect your first account
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <SocialLinkItem key={index} link={link} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}