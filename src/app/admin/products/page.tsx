import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Package, Plus, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Products - Admin",
};

async function getProducts() {
  return prisma.product.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      vendor: { select: { name: true, slug: true } },
      peptide: { select: { name: true, slug: true } },
    },
  });
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-muted-foreground">
            {products.length} products total
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium">Peptide</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Purity</th>
                  <th className="px-4 py-3 font-medium">Form</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/peptide/${product.peptide.slug}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {product.peptide.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendor/${product.vendor.slug}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {product.vendor.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {product.quantity}{product.unit}
                    </td>
                    <td className="px-4 py-3">
                      {product.purity ? `${product.purity}%` : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {product.form}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={product.inStock ? "success" : "secondary"}
                        className="text-xs"
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
