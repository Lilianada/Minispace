import React from 'react'
import ReactMarkdown from 'react-markdown'

interface PagePreviewProps {
  title: string
  content: string
}

export function PagePreview({ title, content }: PagePreviewProps) {
  return (
    <div className="border rounded-md p-6 max-w-3xl mx-auto">
      <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
