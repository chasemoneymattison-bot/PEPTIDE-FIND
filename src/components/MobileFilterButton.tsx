"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SlidersHorizontal, X } from "lucide-react";

export function MobileFilterButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterSidebar />
            <div className="sticky bottom-0 mt-4 border-t bg-white pt-4">
              <Button className="w-full" onClick={() => setOpen(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
