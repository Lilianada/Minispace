import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MarkdownEditor } from '@/components/markdown-editor'
import Link from 'next/link'

interface ContentFormProps {
  title: string
  content: string
  setTitle: (title: string) => void
  setContent: (content: string) => void
}

export function PageContentForm({ title, content, setTitle, setContent }: ContentFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Page Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Page Title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <MarkdownEditor 
          initialValue={content} 
          onChange={(value) => setContent(value)}
        />
        <p className="text-xs text-muted-foreground">
          You can use Markdown to format your content. 
          <Link 
            href="/docs/markdown" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline ml-1"
          >
            View Markdown Guide
          </Link>
        </p>
      </div>
    </div>
  )
}
