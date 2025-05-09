"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Paintbrush, Save } from "lucide-react"

interface SiteFontProps {
  fontFamily: string
  setFontFamily: (fontFamily: string) => void
  isSubmitting: boolean
  onSave: () => void
}

export function SiteFont({
  fontFamily,
  setFontFamily,
  isSubmitting,
  onSave
}: SiteFontProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          Appearance Settings
        </CardTitle>
        <CardDescription>Customize the look and feel of your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-3">
          <Label htmlFor="font-family">Font Family</Label>
          <Select
            value={fontFamily}
            onValueChange={setFontFamily}
            disabled={isSubmitting}
          >
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Select a font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System UI</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The font family used throughout your site
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Font'}
        </Button>
      </CardFooter>
    </Card>
  )
}
