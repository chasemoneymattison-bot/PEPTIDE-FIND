import { Skeleton } from "@/components/ui/skeleton";

export default function PeptideLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="mb-2 h-10 w-64" />
      <Skeleton className="mb-8 h-5 w-96" />
      <Skeleton className="mb-8 h-24 w-full rounded-lg" />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
