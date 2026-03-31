"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RatingStars } from "@/components/RatingStars";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  "Recovery",
  "Growth Hormone",
  "Cognitive",
  "Immune",
  "Skin & Anti-Aging",
  "Sexual Health",
  "Sleep",
  "Tanning",
  "Weight Management",
  "Hormonal",
  "Muscle Growth",
  "Anti-Aging",
];

const FORM_TYPES = [
  { value: "LYOPHILIZED", label: "Lyophilized" },
  { value: "PRE_MIXED", label: "Pre-Mixed" },
  { value: "CAPSULE", label: "Capsule" },
  { value: "NASAL", label: "Nasal Spray" },
];

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length === 0) {
        params.delete(key);
      } else {
        params.set(key, updated.join(","));
      }
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const q = searchParams.get("q") || "";
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }, [router, searchParams]);

  const currentCategory = searchParams.get("category") || "";
  const currentForms = searchParams.get("forms")?.split(",").filter(Boolean) || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinPurity = Number(searchParams.get("minPurity")) || 95;
  const currentMinRating = Number(searchParams.get("minRating")) || 0;
  const usBasedOnly = searchParams.get("usBasedOnly") === "true";
  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const hasLabTesting = searchParams.get("hasLabTesting") === "true";

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-xs">
          <X className="h-3 w-3" />
          Clear all
        </Button>
      </div>

      <div className="space-y-6">
        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <Select value={currentCategory} onValueChange={(v) => updateParam("category", v || null)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={currentMinPrice}
              onChange={(e) => updateParam("minPrice", e.target.value || null)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              value={currentMaxPrice}
              onChange={(e) => updateParam("maxPrice", e.target.value || null)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Min Purity */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Minimum Purity: {currentMinPurity}%
          </label>
          <Slider
            value={[currentMinPurity]}
            onValueChange={([v]) => updateParam("minPurity", v > 95 ? String(v) : null)}
            min={95}
            max={99.9}
            step={0.1}
          />
        </div>

        <Separator />

        {/* Min Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium">Minimum Rating</label>
          <div className="space-y-1">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => updateParam("minRating", currentMinRating === rating ? null : String(rating))}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-secondary ${
                  currentMinRating === rating ? "bg-secondary" : ""
                }`}
              >
                <RatingStars rating={rating} size="sm" />
                <span className="text-muted-foreground">& up</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Form Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">Form Type</label>
          <div className="space-y-2">
            {FORM_TYPES.map((form) => (
              <label key={form.value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={currentForms.includes(form.value)}
                  onCheckedChange={() => toggleArrayParam("forms", form.value)}
                />
                {form.label}
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span>US-Based Only</span>
            <Switch
              checked={usBasedOnly}
              onCheckedChange={(v) => updateParam("usBasedOnly", v ? "true" : null)}
            />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>In Stock Only</span>
            <Switch
              checked={inStockOnly}
              onCheckedChange={(v) => updateParam("inStockOnly", v ? "true" : null)}
            />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Has Lab Testing</span>
            <Switch
              checked={hasLabTesting}
              onCheckedChange={(v) => updateParam("hasLabTesting", v ? "true" : null)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
