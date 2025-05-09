import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'MINISPACE Documentation',
  description: 'Learn how to use MINISPACE to create your lightweight blog',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Documentation</h2>
              <nav className="space-y-1">
                <Link 
                  href="/docs/markdown" 
                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Markdown Guide
                </Link>
                <Link 
                  href="/docs/pages" 
                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors opacity-50"
                >
                  Page Structure
                </Link>
                <Link 
                  href="/docs/themes" 
                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors opacity-50"
                >
                  Themes & Styling
                </Link>
                <Link 
                  href="/docs/api" 
                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors opacity-50"
                >
                  API Reference
                </Link>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
