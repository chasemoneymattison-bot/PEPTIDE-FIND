import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { MapPin, Package, ShieldCheck, FlaskConical, Store } from "lucide-react";

interface VendorCardProps {
  vendor: {
    name: string;
    slug: string;
    description: string | null;
    logoUrl?: string | null;
    location: string | null;
    overallRating: number;
    reviewCount: number;
    isVerified: boolean;
    hasLabTesting: boolean;
    isUSBased: boolean;
    isFeatured: boolean;
    _count?: { products: number };
  };
}

function VendorAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="h-12 w-12 rounded-lg object-cover"
      />
    );
  }

  // Generate a consistent color from vendor name
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-cyan-100 text-cyan-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
  ];
  const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors[colorIndex]}`}
    >
      <Store className="h-6 w-6" />
    </div>
  );
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendor/${vendor.slug}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="mb-3 flex items-start gap-3">
            <VendorAvatar name={vendor.name} logoUrl={vendor.logoUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                  {vendor.name}
                </h3>
                {vendor.isFeatured && (
                  <Badge className="ml-2 shrink-0 bg-accent text-white">Featured</Badge>
                )}
              </div>
              {vendor.location && (
                <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {vendor.location}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <RatingStars rating={vendor.overallRating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({vendor.reviewCount} {vendor.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>

          {vendor.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {vendor.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {vendor.isVerified && (
              <Badge variant="success" className="gap-1 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {vendor.hasLabTesting && (
              <Badge variant="outline" className="gap-1 text-xs">
                <FlaskConical className="h-3 w-3" />
                Lab Tested
              </Badge>
            )}
            {vendor.isUSBased && (
              <Badge variant="outline" className="text-xs">
                US-Based
              </Badge>
            )}
            {vendor._count?.products !== undefined && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Package className="h-3 w-3" />
                {vendor._count.products} products
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
