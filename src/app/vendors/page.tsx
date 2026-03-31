import { prisma } from "@/lib/prisma";
import { VendorCard } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Vendor Directory",
  description:
    "Browse trusted peptide vendors. Compare ratings, lab testing, and product offerings.",
};

interface VendorsPageProps {
  searchParams: {
    usBasedOnly?: string;
    minRating?: string;
    hasLabTesting?: string;
    verified?: string;
    sortBy?: string;
  };
}

async function getVendors(params: VendorsPageProps["searchParams"]) {
  const where: Prisma.VendorWhereInput = {};

  if (params.usBasedOnly === "true") where.isUSBased = true;
  if (params.minRating) where.overallRating = { gte: Number(params.minRating) };
  if (params.hasLabTesting === "true") where.hasLabTesting = true;
  if (params.verified === "true") where.isVerified = true;

  let orderBy: Prisma.VendorOrderByWithRelationInput = { overallRating: "desc" };
  switch (params.sortBy) {
    case "name":
      orderBy = { name: "asc" };
      break;
    case "rating":
      orderBy = { overallRating: "desc" };
      break;
    case "products":
      orderBy = { products: { _count: "desc" } };
      break;
  }

  return prisma.vendor.findMany({
    where,
    include: { _count: { select: { products: true } } },
    orderBy,
  });
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const vendors = await getVendors(searchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vendor Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and compare trusted peptide vendors. All verified vendors undergo
          quality assessment.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <Select defaultValue={searchParams.sortBy || "rating"}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="products">Most Products</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={{
              pathname: "/vendors",
              query: {
                ...searchParams,
                usBasedOnly: searchParams.usBasedOnly === "true" ? undefined : "true",
              },
            }}
          >
            <Button
              variant={searchParams.usBasedOnly === "true" ? "default" : "outline"}
              size="sm"
            >
              US-Based Only
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/vendors",
              query: {
                ...searchParams,
                hasLabTesting: searchParams.hasLabTesting === "true" ? undefined : "true",
              },
            }}
          >
            <Button
              variant={searchParams.hasLabTesting === "true" ? "default" : "outline"}
              size="sm"
            >
              Lab Testing
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/vendors",
              query: {
                ...searchParams,
                verified: searchParams.verified === "true" ? undefined : "true",
              },
            }}
          >
            <Button
              variant={searchParams.verified === "true" ? "default" : "outline"}
              size="sm"
            >
              Verified Only
            </Button>
          </Link>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor as any} />
        ))}
      </div>

      {vendors.length === 0 && (
        <div className="rounded-lg border bg-white p-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No vendors found</h3>
          <p className="mb-4 text-muted-foreground">
            Try adjusting your filters.
          </p>
          <Button asChild>
            <Link href="/vendors">Clear Filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
