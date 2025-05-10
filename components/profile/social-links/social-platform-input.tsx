import { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" 

interface SocialPlatformInputProps {
  platform: string
  icon: ReactNode
  prefix: string
  value: string
  onChange: (value: string) => void
}

export const SocialPlatformInput = ({ 
  platform, 
  icon, 
  prefix, 
  value, 
  onChange 
}: SocialPlatformInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${platform.toLowerCase()}-username`} className="flex items-center gap-1 text-sm font-medium">
        {platform}
      </Label>
      <div className="flex items-stretch">
        <div className="flex items-center justify-center bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
          {icon}
        </div>
        <div className="flex-grow flex items-center bg-muted px-3 border border-x-0 border-input text-sm text-muted-foreground">
          {prefix}
        </div>
        <Input
          id={`${platform.toLowerCase()}-username`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="johndoe"
          className="rounded-l-none"
        />
      </div>
    </div>
  )
}