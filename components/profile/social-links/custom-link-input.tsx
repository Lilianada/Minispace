import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SOCIAL_PLATFORMS } from "./types"

interface CustomLinkInputProps {
  platformName: string
  url: string
  onChangePlatform: (value: string) => void
  onChangeUrl: (value: string) => void
}

export const CustomLinkInput = ({
  platformName,
  url,
  onChangePlatform,
  onChangeUrl
}: CustomLinkInputProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Custom Link (Optional)</h4>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="custom-platform" className="text-right col-span-1">
          Platform
        </Label>
        <div className="col-span-3">
          <Input
            id="custom-platform"
            value={platformName}
            onChange={(e) => onChangePlatform(e.target.value)}
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
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="example.com/profile"
            className="rounded-l-none"
          />
        </div>
      </div>
    </div>
  )
}