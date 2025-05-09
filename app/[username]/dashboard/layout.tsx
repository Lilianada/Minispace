import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import Sidebar from '@/components/sidebar';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  params: {
    username: string;
  };
}

export default async function DashboardLayout({ 
  children, 
  params 
}: DashboardLayoutProps) {
  // In Next.js 13+, dynamic params should be properly awaited
  const resolvedParams = await Promise.resolve(params);
  const { username } = resolvedParams;
  
  const result = await getAuthenticatedUser(username);
  if (result.redirectTo) {
    redirect(result.redirectTo);
  }
  
  // Extract user data
  const { userData } = result;
  
  
  return (
    <div className="max-w-4xl min-h-screen mx-auto w-full flex relative">
      <Sidebar username={username}/>
      
      {/* Content */}
      <main className="flex-1 flex flex-col border-x">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background px-3 lg:h-14 lg:px-4">
          <div className="flex items-center gap-2">
            <Link 
              href={`/${username}/dashboard`} 
              className="flex items-center gap-1 font-medium text-sm"
            >
              <span>MINISPACE</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-sm capitalize text-muted-foreground mr-1">
                 {userData?.displayName || username}
              </span>
            </div>
            <Button variant="outline" size="sm" asChild className="flex items-center gap-1 h-8 px-2">
              <Link href={`/${username}/dashboard/profile`}>
                <User className="h-3.5 w-3.5" />
                <span className="sr-only md:inline text-xs">Profile</span>
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex-1 p-3 md:p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
