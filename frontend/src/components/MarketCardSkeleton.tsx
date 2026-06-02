import { Skeleton } from "./ui/skeleton"

export function MarketCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col space-y-4 rounded-2xl border p-4 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex justify-between border-t pt-4">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  )
}
