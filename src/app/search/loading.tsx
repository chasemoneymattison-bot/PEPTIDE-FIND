import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-14 w-full" />
      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </aside>
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
