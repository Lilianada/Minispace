"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  initialValue?: string
}

export function MarkdownEditor({ initialValue = '# Hello MINISPACE\n\nStart typing your markdown here...' }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue)

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="split">Split View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit" className="mt-0">
        <Textarea
          className="min-h-[300px] font-mono text-sm"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Type your markdown here..."
        />
      </TabsContent>
      
      <TabsContent value="preview" className="mt-0">
        <Card>
          <CardContent className="prose dark:prose-invert max-w-none p-4">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="split" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            className="min-h-[300px] font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
          />
          <Card>
            <CardContent className="prose dark:prose-invert max-w-none p-4 min-h-[300px]">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
