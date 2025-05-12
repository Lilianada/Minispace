import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye, Check } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PageHeaderProps {
  username: string
  isPublished: boolean
  isHomepage: boolean
  isSubmitting: boolean
  isPreviewLoading: boolean
  showPreview: boolean
  handlePublishToggle: () => void
  handleSubmit: () => void
  togglePreview: () => void
}

export function PageHeader({
  username,
  isPublished,
  isHomepage,
  isSubmitting,
  isPreviewLoading,
  showPreview,
  handlePublishToggle,
  handleSubmit,
  togglePreview
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link href={`/${username}/dashboard/pages`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-base font-bold tracking-tight">Edit Page</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <Switch
                  checked={isPublished}
                  onCheckedChange={handlePublishToggle}
                  id="publish-status"
                  disabled={isSubmitting || isHomepage}
                />
                <Label htmlFor="publish-status" className="font-medium text-sm flex items-center">
                  {isHomepage ? (
                    <span className="text-green-500 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Homepage (Always Published)
                    </span>
                  ) : isPublished ? (
                    <span className="text-green-500 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Draft</span>
                  )}
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isHomepage 
                ? "Your homepage is always published" 
                : isPublished 
                  ? "This page is visible to visitors" 
                  : "This page is only visible to you"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="outline"
          size="sm"
          onClick={togglePreview}
          className="h-8"
          disabled={isPreviewLoading}
        >
          <Eye className="h-4 w-4 mr-1" />
          {isPreviewLoading ? "Loading..." : showPreview ? "Edit" : "Preview"}
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-8"
        >
          <Save className="h-4 w-4 mr-1" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
