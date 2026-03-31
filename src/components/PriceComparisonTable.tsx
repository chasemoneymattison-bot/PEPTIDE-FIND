import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { formatPrice, formatPurity } from "@/lib/utils";
import { ExternalLink, ShieldCheck, FlaskConical } from "lucide-react";

interface PriceComparisonTableProps {
  products: Array<{
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
    };
  }>;
}

const formLabels: Record<string, string> = {
  LYOPHILIZED: "Lyophilized",
  PRE_MIXED: "Pre-Mixed",
  CAPSULE: "Capsule",
  NASAL: "Nasal Spray",
};

export function PriceComparisonTable({ products }: PriceComparisonTableProps) {
  const sorted = [...products].sort((a, b) => a.price - b.price);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-muted-foreground">
            <th className="pb-3 pr-4 font-medium">Vendor</th>
            <th className="pb-3 pr-4 font-medium">Price</th>
            <th className="pb-3 pr-4 font-medium">Quantity</th>
            <th className="pb-3 pr-4 font-medium">Purity</th>
            <th className="pb-3 pr-4 font-medium">Form</th>
            <th className="pb-3 pr-4 font-medium">Rating</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((product, index) => (
            <tr key={product.id} className="border-b last:border-0">
              <td className="py-3 pr-4">
                <Link
                  href={`/vendor/${product.vendor.slug}`}
                  className="font-medium hover:text-primary"
                >
                  {product.vendor.name}
                </Link>
                <div className="mt-1 flex gap-1">
                  {product.vendor.isVerified && (
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  )}
                  {product.vendor.hasLabTesting && (
                    <FlaskConical className="h-3.5 w-3.5 text-blue-600" />
                  )}
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className={`font-bold ${index === 0 ? "text-green-600" : ""}`}>
                  {formatPrice(product.price, product.currency)}
                </span>
                {index === 0 && (
                  <Badge variant="success" className="ml-2 text-xs">
                    Lowest
                  </Badge>
                )}
              </td>
              <td className="py-3 pr-4 text-sm">
                {product.quantity}{product.unit}
              </td>
              <td className="py-3 pr-4 text-sm">
                {product.purity ? formatPurity(product.purity) : "N/A"}
              </td>
              <td className="py-3 pr-4 text-sm">
                {formLabels[product.form] || product.form}
              </td>
              <td className="py-3 pr-4">
                <RatingStars rating={product.vendor.overallRating} size="sm" showValue />
              </td>
              <td className="py-3 pr-4">
                <span className={product.inStock ? "text-sm text-green-600" : "text-sm text-red-500"}>
                  {product.inStock ? "In Stock" : "Out"}
                </span>
              </td>
              <td className="py-3">
                <Button asChild size="sm" className="gap-1">
                  <Link href={`/vendor/${product.vendor.slug}`}>
                    View Deal
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
