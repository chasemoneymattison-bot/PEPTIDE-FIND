import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBar } from "@/components/SearchBar";
import { SearchSortSelect } from "@/components/SearchSortSelect";
import { MobileFilterButton } from "@/components/MobileFilterButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Peptides",
  description:
    "Search and compare peptide products from multiple vendors. Filter by price, purity, vendor rating, and more.",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minPurity?: string;
    minRating?: string;
    forms?: string;
    usBasedOnly?: string;
    inStockOnly?: string;
    hasLabTesting?: string;
    sortBy?: string;
    page?: string;
  };
}

async function getSearchResults(params: SearchPageProps["searchParams"]) {
  const page = Number(params.page) || 1;
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {};
  const vendorWhere: Prisma.VendorWhereInput = {};

  // Text search
  if (params.q) {
    where.OR = [
      { peptide: { name: { contains: params.q, mode: "insensitive" } } },
      { peptide: { aliases: { hasSome: [params.q] } } },
      { vendor: { name: { contains: params.q, mode: "insensitive" } } },
      { peptide: { category: { contains: params.q, mode: "insensitive" } } },
    ];
  }

  if (params.category) {
    where.peptide = { ...where.peptide as any, category: params.category };
  }

  if (params.minPrice) where.price = { ...where.price as any, gte: Number(params.minPrice) };
  if (params.maxPrice) where.price = { ...where.price as any, lte: Number(params.maxPrice) };
  if (params.minPurity) where.purity = { gte: Number(params.minPurity) };

  if (params.forms) {
    const formList = params.forms.split(",").filter(Boolean) as any[];
    where.form = { in: formList };
  }

  if (params.inStockOnly === "true") where.inStock = true;
  if (params.usBasedOnly === "true") vendorWhere.isUSBased = true;
  if (params.minRating) vendorWhere.overallRating = { gte: Number(params.minRating) };
  if (params.hasLabTesting === "true") vendorWhere.hasLabTesting = true;

  if (Object.keys(vendorWhere).length > 0) {
    where.vendor = vendorWhere;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (params.sortBy) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { vendor: { overallRating: "desc" } };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        vendor: true,
        peptide: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Count active filters
function countActiveFilters(params: SearchPageProps["searchParams"]): number {
  let count = 0;
  if (params.category) count++;
  if (params.minPrice) count++;
  if (params.maxPrice) count++;
  if (params.minPurity && Number(params.minPurity) > 95) count++;
  if (params.minRating) count++;
  if (params.forms) count++;
  if (params.usBasedOnly === "true") count++;
  if (params.inStockOnly === "true") count++;
  if (params.hasLabTesting === "true") count++;
  return count;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const results = await getSearchResults(searchParams);
  const activeFilterCount = countActiveFilters(searchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar defaultValue={searchParams.q || ""} size="lg" />
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <FilterSidebar className="sticky top-20 rounded-lg border bg-white p-4" />
          </Suspense>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.total}</span>{" "}
                results found
                {searchParams.q && (
                  <span>
                    {" "}for &quot;<span className="font-medium">{searchParams.q}</span>&quot;
                  </span>
                )}
              </p>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <MobileFilterButton />
              <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
                <SearchSortSelect />
              </Suspense>
            </div>
          </div>

          {/* Results Grid */}
          {results.products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-white p-12 text-center">
              <h3 className="mb-2 text-lg font-semibold">No results found</h3>
              <p className="mb-4 text-muted-foreground">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button asChild>
                <Link href="/search">Clear All Filters</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              {results.page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={{
                      pathname: "/search",
                      query: { ...searchParams, page: String(results.page - 1) },
                    }}
                  >
                    Previous
                  </Link>
                </Button>
              )}

              <div className="flex items-center gap-1">
                {(() => {
                  const pages: number[] = [];
                  const total = results.totalPages;
                  const current = results.page;

                  if (total <= 7) {
                    for (let i = 1; i <= total; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (current > 3) pages.push(-1); // ellipsis
                    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                      pages.push(i);
                    }
                    if (current < total - 2) pages.push(-1); // ellipsis
                    pages.push(total);
                  }

                  return pages.map((pageNum, idx) =>
                    pageNum === -1 ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={pageNum}
                        variant={pageNum === current ? "default" : "outline"}
                        size="sm"
                        asChild={pageNum !== current}
                      >
                        {pageNum === current ? (
                          <span>{pageNum}</span>
                        ) : (
                          <Link
                            href={{
                              pathname: "/search",
                              query: { ...searchParams, page: String(pageNum) },
                            }}
                          >
                            {pageNum}
                          </Link>
                        )}
                      </Button>
                    )
                  );
                })()}
              </div>

              {results.page < results.totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={{
                      pathname: "/search",
                      query: { ...searchParams, page: String(results.page + 1) },
                    }}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
