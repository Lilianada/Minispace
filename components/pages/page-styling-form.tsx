import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface PageFormData {
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: string
}

interface PageStylingFormProps {
  metadata: PageFormData
  handleMetadataChange: (key: keyof PageFormData, value: any) => void
}

export function PageStylingForm({ metadata, handleMetadataChange }: PageStylingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Page Styling</CardTitle>
        <CardDescription className="text-xs">
          Customize the appearance of your page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="backgroundColor"
              value={metadata.backgroundColor}
              onChange={(e) => handleMetadataChange("backgroundColor", e.target.value)}
              className="w-10 h-10 rounded-md border border-input"
            />
            <Input
              value={metadata.backgroundColor}
              onChange={(e) => handleMetadataChange("backgroundColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="textColor"
              value={metadata.textColor}
              onChange={(e) => handleMetadataChange("textColor", e.target.value)}
              className="w-10 h-10 rounded-md border border-input"
            />
            <Input
              value={metadata.textColor}
              onChange={(e) => handleMetadataChange("textColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <select
            id="fontFamily"
            value={metadata.fontFamily}
            onChange={(e) => handleMetadataChange("fontFamily", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="system-ui">System UI</option>
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <select
            id="fontSize"
            value={metadata.fontSize}
            onChange={(e) => handleMetadataChange("fontSize", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="14px">Small (14px)</option>
            <option value="16px">Medium (16px)</option>
            <option value="18px">Large (18px)</option>
            <option value="20px">Extra Large (20px)</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
