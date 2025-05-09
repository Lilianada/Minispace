"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Globe, ExternalLink, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DomainSettingsProps {
  customDomain: string
  setCustomDomain: (domain: string) => void
  isVerified: boolean
  isSubmitting: boolean
  onVerify: () => void
  onRemove: () => void
}

export function DomainSettings({
  customDomain,
  setCustomDomain,
  isVerified,
  isSubmitting,
  onVerify,
  onRemove
}: DomainSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Custom Domain
        </CardTitle>
        <CardDescription>Connect your own domain to your MINISPACE site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-domain">Domain Name</Label>
          <div className="flex gap-2">
            <Input
              id="custom-domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value.trim().toLowerCase())}
              placeholder="yourdomain.com"
              disabled={isSubmitting || isVerified}
            />
            {!isVerified ? (
              <Button 
                onClick={onVerify} 
                disabled={isSubmitting || !customDomain || !/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i.test(customDomain)}
              >
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </Button>
            ) : (
              <Button variant="outline" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your domain without http:// or www
          </p>
        </div>
        
        {isVerified && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Domain Verified</AlertTitle>
            <AlertDescription>
              Your custom domain is connected and working properly.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium">DNS Configuration</h3>
          <p className="text-sm text-muted-foreground">
            To connect your domain, add the following DNS records to your domain provider:
          </p>
          
          <div className="rounded-md border p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium">CNAME Record</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm">Host</div>
                <div className="text-sm font-mono">www</div>
                <div className="text-sm">Value</div>
                <div className="text-sm font-mono">cname.minispace.app</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">A Record</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm">Host</div>
                <div className="text-sm font-mono">@</div>
                <div className="text-sm">Value</div>
                <div className="text-sm font-mono">76.76.21.21</div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            DNS changes can take up to 48 hours to propagate.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Need help? <a href="#" className="underline">View our domain setup guide</a>
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href={`https://${customDomain || 'yourdomain.com'}`} target="_blank" rel="noopener noreferrer">
            Visit Site <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
