import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Search, Users, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PeptideFind, the leading peptide comparison platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold">About PeptideFind</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground">
          PeptideFind is the most comprehensive peptide comparison platform on the
          web. We aggregate products from dozens of vendors so researchers can
          quickly compare prices, purity, and vendor reputation in one place.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Our Mission</h2>
        <p className="text-muted-foreground">
          We believe researchers deserve transparency and easy access to the best
          peptide products. Our mission is to bring clarity to the research peptide
          market by providing unbiased comparisons, verified vendor reviews, and
          comprehensive product data.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {[
          { icon: Search, title: "Comprehensive Search", desc: "Search across all vendors simultaneously with advanced filters for price, purity, form, and more." },
          { icon: ShieldCheck, title: "Verified Vendors", desc: "We verify vendor quality through third-party lab testing confirmation and community reviews." },
          { icon: Users, title: "Community Reviews", desc: "Real reviews from real researchers help you make informed decisions about vendors." },
          { icon: FlaskConical, title: "Lab Testing Data", desc: "We highlight vendors who provide certificates of analysis and third-party lab testing." },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="mb-3 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
