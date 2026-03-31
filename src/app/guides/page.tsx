import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & Resources",
  description: "Peptide buying guides, vendor reviews, and research resources.",
};

const guides = [
  {
    title: "Beginner's Guide to Research Peptides",
    description: "Everything you need to know about purchasing research peptides, from understanding purity to choosing a vendor.",
    category: "Buyer's Guide",
    readTime: "8 min read",
    slug: "beginners-guide",
  },
  {
    title: "How to Read a Certificate of Analysis (COA)",
    description: "Learn how to interpret HPLC results, mass spectrometry data, and purity percentages on a COA.",
    category: "Buyer's Guide",
    readTime: "5 min read",
    slug: "reading-coa",
  },
  {
    title: "BPC-157: Complete Research Profile",
    description: "A comprehensive overview of BPC-157 research, including mechanisms of action, dosing protocols studied, and key publications.",
    category: "Peptide Profile",
    readTime: "12 min read",
    slug: "bpc-157-profile",
  },
  {
    title: "TB-500 vs BPC-157: Research Comparison",
    description: "Comparing two of the most popular recovery peptides based on published research and mechanisms.",
    category: "Peptide Profile",
    readTime: "10 min read",
    slug: "tb500-vs-bpc157",
  },
  {
    title: "Top 10 Peptide Vendors Reviewed (2026)",
    description: "Our annual review of the best peptide vendors based on quality testing, pricing, customer service, and community reviews.",
    category: "Vendor Review",
    readTime: "15 min read",
    slug: "top-vendors-2026",
  },
  {
    title: "Understanding Growth Hormone Secretagogues",
    description: "A guide to GHRPs, GHRHs, and combination protocols studied in research settings.",
    category: "Peptide Profile",
    readTime: "10 min read",
    slug: "gh-secretagogues",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Guides & Resources</h1>
        <p className="mt-2 text-muted-foreground">
          Expert guides, peptide profiles, and vendor reviews to help you make
          informed decisions.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`}>
            <Card className="group flex h-full flex-col transition-all hover:shadow-lg hover:-translate-y-0.5">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-accent transition-colors">
                  {guide.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  {guide.description}
                </p>
                <div className="flex items-center gap-1 text-sm font-medium text-accent">
                  <BookOpen className="h-4 w-4" />
                  Read Guide
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
