"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, X, Check } from "lucide-react";
import Link from "next/link";

const MAX_COMPARE = 4;
const STORAGE_KEY = "peptidefind_compare";

function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setCompareIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("compare-updated"));
}

export function CompareToggleButton({ productId }: { productId: string }) {
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    const update = () => setInCompare(getCompareIds().includes(productId));
    update();
    window.addEventListener("compare-updated", update);
    return () => window.removeEventListener("compare-updated", update);
  }, [productId]);

  const toggle = () => {
    const ids = getCompareIds();
    if (ids.includes(productId)) {
      setCompareIds(ids.filter((id) => id !== productId));
    } else {
      if (ids.length >= MAX_COMPARE) return;
      setCompareIds([...ids, productId]);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        inCompare
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
      }`}
      title={inCompare ? "Remove from compare" : "Add to compare"}
    >
      {inCompare ? (
        <>
          <Check className="h-3 w-3" />
          Comparing
        </>
      ) : (
        <>
          <ArrowRightLeft className="h-3 w-3" />
          Compare
        </>
      )}
    </button>
  );
}

export function CompareFloatingBar() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setIds(getCompareIds());
    update();
    window.addEventListener("compare-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("compare-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="flex items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-lg">
        <ArrowRightLeft className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">
          {ids.length} product{ids.length > 1 ? "s" : ""} selected
        </span>
        <Badge variant="secondary" className="text-xs">
          {ids.length}/{MAX_COMPARE}
        </Badge>
        <Button size="sm" asChild>
          <Link href={`/compare?ids=${ids.join(",")}`}>Compare Now</Link>
        </Button>
        <button
          onClick={() => setCompareIds([])}
          className="rounded-full p-1 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
          title="Clear all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
