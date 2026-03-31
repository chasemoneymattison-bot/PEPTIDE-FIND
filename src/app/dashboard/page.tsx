import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/RatingStars";
import { Bell, Bookmark, Star, Settings, Search, ExternalLink, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your saved searches, price alerts, and reviews.",
};

async function getDashboardData(userId: string) {
  const [savedSearches, priceAlerts, reviews] = await Promise.all([
    prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        peptide: { select: { name: true, slug: true } },
      },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        vendor: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return { savedSearches, priceAlerts, reviews };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your saved searches, price alerts, and reviews.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Saved Searches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bookmark className="h-5 w-5 text-accent" />
              Saved Searches
            </CardTitle>
            <Badge variant="secondary">{data.savedSearches.length}</Badge>
          </CardHeader>
          <CardContent>
            {data.savedSearches.length > 0 ? (
              <div className="space-y-2">
                {data.savedSearches.map((search) => {
                  const filters = search.filters as any;
                  return (
                    <Link
                      key={search.id}
                      href={`/search?${new URLSearchParams(filters).toString()}`}
                      className="block rounded-lg border p-2.5 text-sm transition-colors hover:bg-gray-50"
                    >
                      <p className="font-medium">{search.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Save your search filters to quickly run them again later.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/search">
                    <Search className="mr-2 h-4 w-4" />
                    Start Searching
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-accent" />
              Price Alerts
            </CardTitle>
            <Badge variant="secondary">{data.priceAlerts.length}</Badge>
          </CardHeader>
          <CardContent>
            {data.priceAlerts.length > 0 ? (
              <div className="space-y-2">
                {data.priceAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/peptide/${alert.peptide.slug}`}
                    className="block rounded-lg border p-2.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.peptide.name}</p>
                      <Badge
                        variant={alert.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {alert.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: ${alert.targetPrice.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get notified when peptide prices drop below your target.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/search">
                    <Bell className="mr-2 h-4 w-4" />
                    Browse Peptides
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-accent" />
              My Reviews
            </CardTitle>
            <Badge variant="secondary">{data.reviews.length}</Badge>
          </CardHeader>
          <CardContent>
            {data.reviews.length > 0 ? (
              <div className="space-y-2">
                {data.reviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/vendor/${review.vendor.slug}`}
                    className="block rounded-lg border p-2.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="truncate font-medium">{review.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.vendor.name} &bull;{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Share your experience with vendors to help other researchers.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/vendors">
                    <Star className="mr-2 h-4 w-4" />
                    Write a Review
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm text-muted-foreground">
                {(session.user as any).role === "ADMIN" ? "Administrator" : "Researcher"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
