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
      <div className="space-y-6">
        {/* Horizontal Navigation */}
        <div className="w-full">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Documentation</h2>
                <nav className="flex flex-wrap gap-2">
                  <Link 
                    href="/docs/markdown" 
                    className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Markdown Guide
                  </Link>
                  <Link 
                    href="/docs/pages" 
                    className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium opacity-50"
                  >
                    Page Structure
                  </Link>
                  <Link 
                    href="/docs/themes" 
                    className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium opacity-50"
                  >
                    Themes & Styling
                  </Link>
                  <Link 
                    href="/docs/api" 
                    className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium opacity-50"
                  >
                    API Reference
                  </Link>
                </nav>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
