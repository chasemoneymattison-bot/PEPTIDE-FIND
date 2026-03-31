import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <h2 className="mb-2 text-xl font-semibold">Page Not Found</h2>
      <p className="mb-6 max-w-md text-center text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Try searching for what you need.
      </p>
      <SearchBar className="mb-6 w-full max-w-md" />
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Browse Peptides</Link>
        </Button>
      </div>
    </div>
  );
}
