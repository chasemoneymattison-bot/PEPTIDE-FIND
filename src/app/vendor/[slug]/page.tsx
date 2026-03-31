import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { RatingStars } from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  MapPin,
  ShieldCheck,
  FlaskConical,
  ExternalLink,
  Star,
  Store,
} from "lucide-react";
import type { Metadata } from "next";

interface VendorPageProps {
  params: { slug: string };
}

async function getVendor(slug: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { slug },
    include: {
      products: {
        include: { peptide: true, vendor: true },
        orderBy: { price: "asc" },
      },
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return vendor;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const vendor = await getVendor(params.slug);
  if (!vendor) return { title: "Vendor Not Found" };

  return {
    title: `${vendor.name} - Vendor Profile`,
    description: `${vendor.name} offers ${vendor.products.length} peptide products. Rating: ${vendor.overallRating}/5. ${vendor.description?.slice(0, 100)}`,
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const vendor = await getVendor(params.slug);
  if (!vendor) notFound();

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: vendor.reviews.filter((r) => r.rating === star).length,
    percentage:
      vendor.reviews.length > 0
        ? (vendor.reviews.filter((r) => r.rating === star).length / vendor.reviews.length) * 100
        : 0,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: vendor.name,
            description: vendor.description,
            url: vendor.website,
            address: vendor.location
              ? { "@type": "PostalAddress", addressLocality: vendor.location }
              : undefined,
            aggregateRating: vendor.reviewCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: vendor.overallRating,
                  reviewCount: vendor.reviewCount,
                  bestRating: 5,
                }
              : undefined,
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/vendors" className="hover:text-foreground">Vendors</Link>
        <span>/</span>
        <span className="text-foreground">{vendor.name}</span>
      </nav>

      {/* Vendor Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-4">
            {vendor.logoUrl ? (
              <img
                src={vendor.logoUrl}
                alt={`${vendor.name} logo`}
                className="h-16 w-16 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-sm">
                <Store className="h-8 w-8" />
              </div>
            )}
            <h1 className="text-3xl font-bold">{vendor.name}</h1>
            {vendor.isVerified && (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {vendor.isFeatured && (
              <Badge className="bg-accent text-white">Featured</Badge>
            )}
          </div>

          <div className="mb-3 flex items-center gap-4">
            <RatingStars rating={vendor.overallRating} size="md" showValue />
            <span className="text-sm text-muted-foreground">
              ({vendor.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {vendor.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vendor.location}
              </span>
            )}
            {vendor.hasLabTesting && (
              <span className="flex items-center gap-1 text-blue-600">
                <FlaskConical className="h-4 w-4" />
                Lab Testing
              </span>
            )}
            {vendor.isUSBased && (
              <Badge variant="outline">US-Based</Badge>
            )}
          </div>

          {vendor.description && (
            <p className="leading-relaxed text-muted-foreground">{vendor.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {vendor.website && (
            <Button asChild className="gap-2">
              <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Products */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              Products ({vendor.products.length})
            </h2>
            {vendor.products.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {vendor.products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No products listed yet.</p>
            )}
          </div>

          <Separator className="mb-8" />

          {/* Reviews */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Reviews ({vendor.reviews.length})
            </h2>
            <div className="space-y-4">
              {vendor.reviews.map((review) => (
                <ReviewCard key={review.id} review={review as any} />
              ))}
              {vendor.reviews.length === 0 && (
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              )}
            </div>

            <Separator className="my-8" />
            <ReviewForm vendorId={vendor.id} />
          </div>
        </div>

        {/* Sidebar - Rating Breakdown */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <p className="text-4xl font-bold">{vendor.overallRating.toFixed(1)}</p>
                <RatingStars rating={vendor.overallRating} size="lg" className="justify-center" />
                <p className="mt-1 text-sm text-muted-foreground">
                  {vendor.reviewCount} reviews
                </p>
              </div>
              <div className="space-y-2">
                {ratingBreakdown.map((item) => (
                  <div key={item.star} className="flex items-center gap-2">
                    <span className="flex w-8 items-center gap-1 text-sm">
                      {item.star}
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-yellow-400"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
