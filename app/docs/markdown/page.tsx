"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownEditor } from '@/components/markdown-editor';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function MarkdownGuidePage() {
  const markdownExamples = [
    {
      title: 'Headings',
      description: 'Create headings using # symbols',
      example: `# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6`,
      rendered: (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Heading 1</h1>
          <h2 className="text-2xl font-bold">Heading 2</h2>
          <h3 className="text-xl font-bold">Heading 3</h3>
          <h4 className="text-lg font-bold">Heading 4</h4>
          <h5 className="text-base font-bold">Heading 5</h5>
          <h6 className="text-sm font-bold">Heading 6</h6>
        </div>
      )
    },
    {
      title: 'Text Formatting',
      description: 'Format text with bold, italic, and strikethrough',
      example: `**Bold text**\n*Italic text*\n~~Strikethrough~~\n\n**Bold and _nested italic_**`,
      rendered: (
        <div className="space-y-2">
          <p><strong>Bold text</strong></p>
          <p><em>Italic text</em></p>
          <p><del>Strikethrough</del></p>
          <p><strong>Bold and <em>nested italic</em></strong></p>
        </div>
      )
    },
    {
      title: 'Lists',
      description: 'Create ordered and unordered lists',
      example: `- Unordered item 1\n- Unordered item 2\n  - Nested item\n  - Another nested item\n- Unordered item 3\n\n1. Ordered item 1\n2. Ordered item 2\n3. Ordered item 3`,
      rendered: (
        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-1">
            <li>Unordered item 1</li>
            <li>Unordered item 2
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Nested item</li>
                <li>Another nested item</li>
              </ul>
            </li>
            <li>Unordered item 3</li>
          </ul>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Ordered item 1</li>
            <li>Ordered item 2</li>
            <li>Ordered item 3</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Links',
      description: 'Create hyperlinks to other pages',
      example: `[Link text](https://example.com)\n\n[Link with title](https://example.com "Link title")`,
      rendered: (
        <div className="space-y-2">
          <p><a href="#" className="text-blue-600 hover:underline">Link text</a></p>
          <p><a href="#" className="text-blue-600 hover:underline" title="Link title">Link with title</a></p>
        </div>
      )
    },
    {
      title: 'Images',
      description: 'Embed images in your content',
      example: `![Alt text](https://via.placeholder.com/150)\n\n![Alt text with title](https://via.placeholder.com/150 "Image title")`,
      rendered: (
        <div className="space-y-4">
          <p><img src="https://via.placeholder.com/150" alt="Alt text" className="max-w-full" /></p>
          <p><img src="https://via.placeholder.com/150" alt="Alt text with title" title="Image title" className="max-w-full" /></p>
        </div>
      )
    },
    {
      title: 'Blockquotes',
      description: 'Create blockquotes for citations or highlights',
      example: `> This is a blockquote\n>\n> It can span multiple lines`,
      rendered: (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 italic">
          <p>This is a blockquote</p>
          <p>It can span multiple lines</p>
        </blockquote>
      )
    },
    {
      title: 'Code',
      description: 'Format inline code and code blocks',
      example: "Inline `code` with backticks\n\n```\n// Code block\nfunction hello() {\n  console.log('Hello world!');\n}\n```",
      rendered: (
        <div className="space-y-4">
          <p>Inline <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">code</code> with backticks</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            <code>
              {`// Code block
function hello() {
  console.log('Hello world!');
}`}
            </code>
          </pre>
        </div>
      )
    },
    {
      title: 'Tables',
      description: 'Create tables to organize data',
      example: `| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |`,
      rendered: (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Header 1</th>
              <th className="py-2 px-4 text-left">Header 2</th>
              <th className="py-2 px-4 text-left">Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Cell 1</td>
              <td className="py-2 px-4">Cell 2</td>
              <td className="py-2 px-4">Cell 3</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Cell 4</td>
              <td className="py-2 px-4">Cell 5</td>
              <td className="py-2 px-4">Cell 6</td>
            </tr>
          </tbody>
        </table>
      )
    },
    {
      title: 'Horizontal Rule',
      description: 'Add a horizontal line to separate content',
      example: `Above the line\n\n---\n\nBelow the line`,
      rendered: (
        <div className="space-y-4">
          <p>Above the line</p>
          <hr className="border-t border-gray-300 dark:border-gray-700" />
          <p>Below the line</p>
        </div>
      )
    }
  ];

  const initialMarkdown = `# Welcome to MINISPACE Markdown

This is a **live editor** where you can test your markdown formatting.

## Try some examples:

- Create a list
- Add *italic* or **bold** text
- [Add a link](https://minispace.dev)
- > Add a blockquote

### Code example:
\`\`\`
function hello() {
  console.log("Hello MINISPACE!");
}
\`\`\`

Happy writing!
`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markdown Guide</h1>
        <p className="text-muted-foreground">
          Learn how to format your content with Markdown syntax.
        </p>
      </div>

      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          MINISPACE uses Markdown for content formatting. Markdown is a lightweight markup language that allows you to write using an easy-to-read, easy-to-write plain text format that converts to HTML.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Try It Yourself</CardTitle>
          <CardDescription>
            Use this interactive editor to test your Markdown formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor initialValue={initialMarkdown} />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Markdown Syntax Reference</h2>

      <div className="space-y-8">
        {markdownExamples.map((example) => (
          <Card key={example.title}>
            <CardHeader>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="example">
                <TabsList>
                  <TabsTrigger value="example">Markdown</TabsTrigger>
                  <TabsTrigger value="rendered">Rendered</TabsTrigger>
                </TabsList>
                <TabsContent value="example">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
                    <code>{example.example}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="rendered">
                  <div className="p-4">
                    {example.rendered}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
