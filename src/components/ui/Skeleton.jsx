import { cn } from '@/utils/cn.js'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-border/70', className)} aria-hidden />
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4 border-t border-border pt-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  )
}

export function TestimonialCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
