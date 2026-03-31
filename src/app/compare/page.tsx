import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { formatPrice, formatPurity } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import {
  ExternalLink,
  ShieldCheck,
  FlaskConical,
  Check,
  X,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare peptide products side-by-side across vendors.",
};

interface ComparePageProps {
  searchParams: {
    ids?: string;
  };
}

const formLabels: Record<string, string> = {
  LYOPHILIZED: "Lyophilized",
  PRE_MIXED: "Pre-Mixed",
  CAPSULE: "Capsule",
  NASAL: "Nasal Spray",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const productIds = searchParams.ids?.split(",").filter(Boolean) || [];

  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          include: { vendor: true, peptide: true },
        })
      : [];

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold">Compare Products</h1>
        <p className="mb-8 text-muted-foreground">
          Select 2-4 products from search results to compare them side by side.
        </p>
        <Card className="p-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No products selected</h3>
          <p className="mb-4 text-muted-foreground">
            Search for peptides and add products to your comparison.
          </p>
          <Button asChild>
            <Link href="/search">Search Peptides</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Compare Products</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="w-48 pb-4 text-left text-sm font-medium text-muted-foreground">
                Feature
              </th>
              {products.map((product) => (
                <th key={product.id} className="pb-4 text-left">
                  <div className="pr-4">
                    <p className="font-semibold">{product.peptide.name}</p>
                    <Link
                      href={`/vendor/${product.vendor.slug}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {product.vendor.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Price</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4 text-lg font-bold text-primary">
                  {formatPrice(p.price, p.currency)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Quantity</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {p.quantity}{p.unit}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Purity</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {p.purity ? formatPurity(p.purity) : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Form</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {formLabels[p.form] || p.form}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">In Stock</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {p.inStock ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500">
                      <X className="h-4 w-4" /> No
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Vendor Rating</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  <RatingStars rating={p.vendor.overallRating} size="sm" showValue />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Verified</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {p.vendor.isVerified ? (
                    <Badge variant="success" className="gap-1">
                      <ShieldCheck className="h-3 w-3" /> Yes
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Lab Testing</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  {p.vendor.hasLabTesting ? (
                    <Badge variant="outline" className="gap-1">
                      <FlaskConical className="h-3 w-3" /> Yes
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-muted-foreground">Location</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4 text-sm">
                  {p.vendor.location || "N/A"}
                  {p.vendor.isUSBased && (
                    <Badge variant="outline" className="ml-2 text-xs">US</Badge>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3"></td>
              {products.map((p) => (
                <td key={p.id} className="py-3 pr-4">
                  <Button asChild size="sm" className="gap-1">
                    <Link href={`/api/redirect/${p.id}`} target="_blank" rel="noopener noreferrer">
                      View Deal <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
