import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { RatingStars } from "@/components/RatingStars";
import { prisma } from "@/lib/prisma";
import {
  FlaskConical,
  Search,
  ArrowRightLeft,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  Store,
} from "lucide-react";

async function getHomepageData() {
  const [peptides, vendors, stats] = await Promise.all([
    prisma.peptide.findMany({
      take: 8,
      include: {
        products: { select: { id: true } },
      },
      orderBy: { products: { _count: "desc" } },
    }),
    prisma.vendor.findMany({
      where: { isFeatured: true },
      take: 6,
      include: { _count: { select: { products: true } } },
    }),
    Promise.all([
      prisma.product.count(),
      prisma.vendor.count(),
      prisma.peptide.count(),
      prisma.review.count(),
    ]),
  ]);

  return {
    peptides,
    vendors,
    productCount: stats[0],
    vendorCount: stats[1],
    peptideCount: stats[2],
    reviewCount: stats[3],
  };
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-accent-900 px-4 py-24 text-white sm:py-28">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <FlaskConical className="h-4 w-4" />
            Trusted by researchers worldwide
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the Best Peptide Prices
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Compare prices from {data.vendorCount}+ verified vendors across{" "}
            {data.productCount.toLocaleString()}+ products. Find the best deals on
            research peptides in seconds.
          </p>
          <SearchBar
            size="lg"
            placeholder="Search peptides (e.g., BPC-157, TB-500, Ipamorelin)..."
            className="mx-auto max-w-2xl"
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-primary-200">Popular:</span>
            {["BPC-157", "TB-500", "Ipamorelin", "Sermorelin", "CJC-1295"].map(
              (name) => (
                <Link
                  key={name}
                  href={`/peptide/${name.toLowerCase()}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20"
                >
                  {name}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:gap-16">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold">{data.productCount.toLocaleString()}+</span>
            <span className="text-sm text-muted-foreground">Products</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold">{data.vendorCount}+</span>
            <span className="text-sm text-muted-foreground">Vendors</span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold">{data.peptideCount}+</span>
            <span className="text-sm text-muted-foreground">Peptides</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold">{data.reviewCount}+</span>
            <span className="text-sm text-muted-foreground">Reviews</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Search className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">1. Search</h3>
              <p className="text-muted-foreground">
                Search for any peptide and instantly see all available products across
                multiple vendors.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <ArrowRightLeft className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">2. Compare</h3>
              <p className="text-muted-foreground">
                Compare prices, purity, vendor ratings, and lab testing side by side
                to find the best deal.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <ShoppingCart className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">3. Buy</h3>
              <p className="text-muted-foreground">
                Click through to the vendor&apos;s site to purchase with confidence,
                backed by community reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Peptides */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Popular Peptides</h2>
            <Button variant="outline" asChild>
              <Link href="/search">View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.peptides.map((peptide) => (
              <Link key={peptide.id} href={`/peptide/${peptide.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold">{peptide.name}</h3>
                    {peptide.category && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {peptide.category}
                      </Badge>
                    )}
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {peptide.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {peptide.products.length} listings
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Vendors</h2>
            <Button variant="outline" asChild>
              <Link href="/vendors">All Vendors</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.vendors.map((vendor) => (
              <Link key={vendor.id} href={`/vendor/${vendor.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      {vendor.logoUrl ? (
                        <img src={vendor.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                          <Store className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{vendor.name}</h3>
                      </div>
                      <Badge className="shrink-0 bg-accent text-white">Featured</Badge>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <RatingStars rating={vendor.overallRating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        ({vendor.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {vendor.description}
                    </p>
                    <div className="flex gap-2">
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
                      <Badge variant="secondary" className="text-xs">
                        {vendor._count.products} products
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-accent-900 px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Start Comparing Peptide Prices Today
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join thousands of researchers who use PeptideFind to find the best deals
            on research peptides.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/search">Search Peptides</Link>
            </Button>
            <Button size="lg" className="border border-white/30 bg-transparent text-white hover:bg-white/10" asChild>
              <Link href="/vendors">Browse Vendors</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
