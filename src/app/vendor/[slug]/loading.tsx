import { Skeleton } from "@/components/ui/skeleton";

export default function VendorLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="mb-8 flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <Skeleton className="mb-3 h-10 w-64" />
          <Skeleton className="mb-3 h-5 w-48" />
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="mb-4 h-8 w-40" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </div>
  );
}
