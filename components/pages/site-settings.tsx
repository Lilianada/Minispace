"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import Link from "next/link"

interface SiteSettingsProps {
  username: string
  headerText: string
  setHeaderText: (text: string) => void
  footerText: string
  setFooterText: (text: string) => void
  onSave: () => void
  isSaving: boolean
}

export function SiteSettings({
  username,
  headerText,
  setHeaderText,
  footerText,
  setFooterText,
  onSave,
  isSaving
}: SiteSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Configure your site header and footer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="header-text">Header Text</Label>
          <Input
            id="header-text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            placeholder="Your site name"
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed in the header of your site
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footer-text">Footer Text</Label>
          <Input
            id="footer-text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder={`© ${new Date().getFullYear()} ${username}`}
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed in the footer of your site
          </p>
        </div>
        
        <div className="pt-2">
          <Button onClick={onSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Site Settings
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t py-3">
        <p className="text-xs text-muted-foreground">
          To add social links to your footer, visit your <Link href={`/${username}/dashboard/profile`} className="underline">profile settings</Link>.
        </p>
      </CardFooter>
    </Card>
  )
}
