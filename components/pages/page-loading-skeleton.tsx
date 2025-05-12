import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="grid gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
