import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PriceComparisonTable } from "@/components/PriceComparisonTable";
import { PriceAlertButton } from "@/components/PriceAlertModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Bell, Tag, FlaskConical, TrendingDown, BarChart3 } from "lucide-react";
import type { Metadata } from "next";

interface PeptidePageProps {
  params: { slug: string };
}

async function getPeptide(slug: string) {
  const peptide = await prisma.peptide.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          vendor: true,
        },
        where: { inStock: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!peptide) return null;

  const relatedPeptides = await prisma.peptide.findMany({
    where: {
      category: peptide.category,
      id: { not: peptide.id },
    },
    take: 4,
    include: {
      products: { select: { id: true }, take: 1 },
    },
  });

  return { peptide, relatedPeptides };
}

export async function generateMetadata({ params }: PeptidePageProps): Promise<Metadata> {
  const data = await getPeptide(params.slug);
  if (!data) return { title: "Peptide Not Found" };

  return {
    title: `${data.peptide.name} - Compare Prices`,
    description: `Compare ${data.peptide.name} prices from ${data.peptide.products.length} vendors. ${data.peptide.description?.slice(0, 120)}`,
  };
}

export default async function PeptidePage({ params }: PeptidePageProps) {
  const data = await getPeptide(params.slug);
  if (!data) notFound();

  const { peptide, relatedPeptides } = data;
  const prices = peptide.products.map((p) => p.price);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: peptide.name,
            description: peptide.description,
            category: peptide.category,
            offers: {
              "@type": "AggregateOffer",
              lowPrice: lowestPrice,
              highPrice: highestPrice,
              priceCurrency: "USD",
              offerCount: peptide.products.length,
              offers: peptide.products.map((p) => ({
                "@type": "Offer",
                price: p.price,
                priceCurrency: "USD",
                seller: { "@type": "Organization", name: p.vendor.name },
                availability: p.inStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              })),
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-foreground">Peptides</Link>
        <span>/</span>
        <span className="text-foreground">{peptide.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{peptide.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {peptide.category && (
              <Badge variant="secondary">{peptide.category}</Badge>
            )}
            {peptide.casNumber && (
              <Badge variant="outline" className="gap-1">
                <Tag className="h-3 w-3" />
                CAS: {peptide.casNumber}
              </Badge>
            )}
          </div>
          {peptide.aliases.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Also known as: {peptide.aliases.join(", ")}
            </p>
          )}
        </div>
        <PriceAlertButton
          peptideId={peptide.id}
          peptideName={peptide.name}
          currentLowestPrice={lowestPrice}
        />
      </div>

      {/* Description */}
      {peptide.description && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="leading-relaxed text-muted-foreground">{peptide.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Price Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingDown className="mx-auto mb-2 h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Lowest Price</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(lowestPrice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="mx-auto mb-2 h-5 w-5 text-accent" />
            <p className="text-sm text-muted-foreground">Average Price</p>
            <p className="text-2xl font-bold">{formatPrice(avgPrice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FlaskConical className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Vendors</p>
            <p className="text-2xl font-bold">{peptide.products.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Price Comparison Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Compare Prices</CardTitle>
        </CardHeader>
        <CardContent>
          {peptide.products.length > 0 ? (
            <PriceComparisonTable products={peptide.products as any} />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No products currently available for this peptide.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Related Peptides */}
      {relatedPeptides.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Related Peptides</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {relatedPeptides.map((related) => (
              <Link key={related.id} href={`/peptide/${related.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{related.name}</h3>
                    {related.category && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {related.category}
                      </Badge>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {related.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
