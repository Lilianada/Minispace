import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, Palette, Code, BookOpen } from 'lucide-react';

export default function DocsPage() {
  const docSections = [
    {
      title: 'Markdown Guide',
      description: 'Learn how to format your content with Markdown syntax',
      icon: <FileText className="h-6 w-6" />,
      href: '/docs/markdown',
      available: true,
    },
    {
      title: 'Page Structure',
      description: 'Understand how pages and content blocks are organized',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/docs/pages',
      available: false,
    },
    {
      title: 'Themes & Styling',
      description: 'Customize the look and feel of your MINISPACE blog',
      icon: <Palette className="h-6 w-6" />,
      href: '/docs/themes',
      available: false,
    },
    {
      title: 'API Reference',
      description: 'Technical documentation for developers',
      icon: <Code className="h-6 w-6" />,
      href: '/docs/api',
      available: false,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MINISPACE Documentation</h1>
        <p className="text-muted-foreground">
          Everything you need to know about creating and managing your lightweight blog.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docSections.map((section) => (
          <Link 
            key={section.title} 
            href={section.available ? section.href : '#'}
            className={!section.available ? 'pointer-events-none' : ''}
          >
            <Card className={!section.available ? 'opacity-60' : 'hover:shadow-md transition-shadow'}>
              <CardHeader className="flex flex-row items-center gap-4">
                {section.icon}
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {!section.available && (
                  <div className="text-sm text-muted-foreground">Coming soon</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
