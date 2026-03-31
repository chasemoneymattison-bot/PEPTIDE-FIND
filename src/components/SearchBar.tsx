"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "default" | "lg";
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search peptides, vendors, or categories...",
  size = "default",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center">
        <Search className={`absolute left-3 text-muted-foreground ${size === "lg" ? "h-5 w-5" : "h-4 w-4"}`} />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`${size === "lg" ? "h-14 pl-11 pr-28 text-lg" : "h-10 pl-9 pr-20"}`}
        />
        <Button
          type="submit"
          className={`absolute right-1.5 ${size === "lg" ? "h-10 px-6" : "h-7 px-3 text-sm"}`}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
