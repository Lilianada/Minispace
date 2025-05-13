"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container max-w-screen-xl mx-auto py-4 animate-in fade-in">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        
        {/* Stats cards loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Skeleton className="h-[100px] rounded-lg" />
          <Skeleton className="h-[100px] rounded-lg" />
          <Skeleton className="h-[100px] rounded-lg" />
        </div>
        
        {/* Quick actions loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-6">
          <Skeleton className="h-[60px] rounded-md" />
          <Skeleton className="h-[60px] rounded-md" />
          <Skeleton className="h-[60px] rounded-md" />
          <Skeleton className="h-[60px] rounded-md" />
          <Skeleton className="h-[60px] rounded-md" />
        </div>
        
        {/* Content section loading */}
        <Skeleton className="h-[120px] mt-6" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>
  );
}
