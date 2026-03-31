import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { AdminReviewRemoveButton } from "@/components/admin/AdminReviewRemoveButton";
import Link from "next/link";
import {
  Users,
  Package,
  FlaskConical,
  Star,
  ShieldCheck,
  Store,
  MousePointerClick,
  Plus,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing vendors, products, and reviews.",
};

async function getAdminStats() {
  const [vendorCount, productCount, peptideCount, reviewCount, userCount, clickCount] =
    await Promise.all([
      prisma.vendor.count(),
      prisma.product.count(),
      prisma.peptide.count(),
      prisma.review.count(),
      prisma.user.count(),
      prisma.clickLog.count(),
    ]);

  const recentVendors = await prisma.vendor.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true, reviews: true } } },
  });

  const recentReviews = await prisma.review.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      vendor: { select: { name: true, slug: true } },
    },
  });

  const topClicked = await prisma.clickLog.groupBy({
    by: ["vendorId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  return {
    vendorCount,
    productCount,
    peptideCount,
    reviewCount,
    userCount,
    clickCount,
    recentVendors,
    recentReviews,
    topClicked,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage vendors, products, users, and reviews.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/vendors/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Vendors", value: stats.vendorCount, icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Products", value: stats.productCount, icon: Package, color: "text-green-600", bg: "bg-green-50" },
          { label: "Peptides", value: stats.peptideCount, icon: FlaskConical, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Reviews", value: stats.reviewCount, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Users", value: stats.userCount, icon: Users, color: "text-pink-600", bg: "bg-pink-50" },
          { label: "Clicks", value: stats.clickCount, icon: MousePointerClick, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Vendors Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Vendors</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/vendors/new" className="gap-1">
                <Plus className="h-3 w-3" />
                Add
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentVendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/admin/vendors/${vendor.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{vendor.name}</p>
                      {vendor.isVerified && (
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{vendor._count.products} products</span>
                      <span>{vendor._count.reviews} reviews</span>
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {vendor.subscriptionTier}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="truncate text-sm font-medium">
                        {review.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.user.name || review.user.email} &rarr;{" "}
                      <Link
                        href={`/vendor/${review.vendor.slug}`}
                        className="text-accent hover:underline"
                      >
                        {review.vendor.name}
                      </Link>
                    </p>
                  </div>
                  <AdminReviewRemoveButton reviewId={review.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
