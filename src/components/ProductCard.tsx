import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { formatPrice, formatPurity } from "@/lib/utils";
import { CompareToggleButton } from "@/components/CompareButton";
import { ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    price: number;
    currency: string;
    quantity: number;
    unit: string;
    purity: number | null;
    form: string;
    inStock: boolean;
    vendor: {
      name: string;
      slug: string;
      overallRating: number;
      isVerified: boolean;
      hasLabTesting: boolean;
      isUSBased: boolean;
    };
    peptide: {
      name: string;
      slug: string;
      category: string | null;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formLabels: Record<string, string> = {
    LYOPHILIZED: "Lyophilized",
    PRE_MIXED: "Pre-Mixed",
    CAPSULE: "Capsule",
    NASAL: "Nasal Spray",
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex-1 p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <Link
              href={`/peptide/${product.peptide.slug}`}
              className="text-lg font-semibold text-primary hover:underline"
            >
              {product.peptide.name}
            </Link>
            {product.peptide.category && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {product.peptide.category}
              </Badge>
            )}
          </div>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        <div className="mb-3">
          <Link
            href={`/vendor/${product.vendor.slug}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {product.vendor.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            {product.vendor.isVerified && (
              <Badge variant="success" className="gap-1 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {product.vendor.hasLabTesting && (
              <Badge variant="outline" className="gap-1 text-xs">
                <FlaskConical className="h-3 w-3" />
                Lab Tested
              </Badge>
            )}
            {product.vendor.isUSBased && (
              <Badge variant="outline" className="text-xs">
                US-Based
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <RatingStars rating={product.vendor.overallRating} size="sm" />
          <span className="text-sm text-muted-foreground">
            ({product.vendor.overallRating.toFixed(1)})
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Quantity:</span>{" "}
            <span className="font-medium">
              {product.quantity}
              {product.unit}
            </span>
          </div>
          {product.purity && (
            <div>
              <span className="text-muted-foreground">Purity:</span>{" "}
              <span className="font-medium">{formatPurity(product.purity)}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Form:</span>{" "}
            <span className="font-medium">{formLabels[product.form] || product.form}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Stock:</span>{" "}
            <span className={product.inStock ? "font-medium text-green-600" : "font-medium text-red-500"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 p-4 pt-0">
        <Button asChild className="w-full gap-2">
          <Link href={`/vendor/${product.vendor.slug}`}>
            View Deal
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <CompareToggleButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}
