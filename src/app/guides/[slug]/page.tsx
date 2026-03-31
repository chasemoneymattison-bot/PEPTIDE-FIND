import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import type { Metadata } from "next";

const guidesContent: Record<
  string,
  {
    title: string;
    category: string;
    readTime: string;
    content: string[];
  }
> = {
  "beginners-guide": {
    title: "Beginner's Guide to Research Peptides",
    category: "Buyer's Guide",
    readTime: "8 min read",
    content: [
      "Research peptides are short chains of amino acids used extensively in scientific research. They play a crucial role in understanding biological processes, developing new therapies, and advancing our knowledge of human physiology.",
      "## What Are Peptides?\n\nPeptides are molecules consisting of two or more amino acids linked by peptide bonds. While proteins contain 50+ amino acids, peptides are generally shorter chains. Research peptides are synthesized in laboratories for use in scientific studies and are not intended for human consumption.",
      "## How to Choose a Vendor\n\nWhen selecting a peptide vendor, consider the following factors:\n\n- **Purity**: Look for peptides with 98%+ purity verified by HPLC testing\n- **Third-party testing**: Reputable vendors provide Certificates of Analysis (COAs) from independent labs\n- **Reputation**: Check community reviews and ratings on platforms like PeptideFind\n- **Pricing**: Compare prices across multiple vendors to ensure fair pricing\n- **Shipping**: Consider shipping times, packaging quality, and cold-chain requirements",
      "## Understanding Purity\n\nPeptide purity is typically measured using High-Performance Liquid Chromatography (HPLC). A purity of 98% or higher is considered research-grade. Lower purity peptides may contain impurities that could affect experimental results.",
      "## Storage and Handling\n\nMost research peptides should be:\n\n- Stored at -20\u00b0C for long-term storage\n- Reconstituted with bacteriostatic water when ready for use\n- Protected from light and excessive heat\n- Used within a reasonable timeframe after reconstitution",
      "## Using PeptideFind\n\nPeptideFind makes it easy to compare prices and vendors. Simply search for your peptide, compare prices from multiple vendors, check vendor ratings and reviews, and click through to purchase with confidence.",
    ],
  },
  "reading-coa": {
    title: "How to Read a Certificate of Analysis (COA)",
    category: "Buyer's Guide",
    readTime: "5 min read",
    content: [
      "A Certificate of Analysis (COA) is a document provided by peptide vendors that details the quality and purity of a specific batch of peptides. Understanding how to read a COA is essential for any researcher working with peptides.",
      "## Key Components of a COA\n\n- **Product identification**: Peptide name, sequence, molecular weight, and batch/lot number\n- **HPLC results**: Shows purity percentage and retention time\n- **Mass spectrometry (MS)**: Confirms the molecular identity of the peptide\n- **Appearance**: Visual description of the peptide (usually white to off-white powder)\n- **Solubility**: Information about how the peptide dissolves",
      "## Understanding HPLC Results\n\nHPLC (High-Performance Liquid Chromatography) separates the components of a sample. The main peak represents your target peptide, and its area percentage indicates purity. Look for:\n\n- **Purity \u226598%**: Research-grade quality\n- **Purity 95-98%**: Acceptable for many applications\n- **Purity <95%**: May contain significant impurities",
      "## Red Flags to Watch For\n\n- Missing batch/lot numbers\n- No date on the COA\n- Only one type of testing (should have both HPLC and MS)\n- Generic COAs not tied to a specific batch\n- Purity claims without supporting chromatogram data",
      "## Verifying Authenticity\n\nSome vendors provide COAs from third-party laboratories, which adds an extra layer of credibility. On PeptideFind, vendors with verified lab testing are marked with a special badge.",
    ],
  },
  "bpc-157-profile": {
    title: "BPC-157: Complete Research Profile",
    category: "Peptide Profile",
    readTime: "12 min read",
    content: [
      "BPC-157 (Body Protection Compound-157) is a pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) found in human gastric juice and has been extensively studied for its potential regenerative properties.",
      "## Chemical Properties\n\n- **Sequence**: Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val\n- **Molecular Formula**: C\u2086\u2082H\u2089\u2088N\u2081\u2086O\u2082\u2082\n- **Molecular Weight**: 1419.53 g/mol\n- **CAS Number**: 137525-51-0\n- **Stability**: Stable in human gastric juice (unlike many peptides)",
      "## Research Areas\n\nBPC-157 has been studied in numerous animal models for:\n\n- **Wound healing**: Multiple studies show accelerated healing of skin wounds, muscle injuries, and tendon damage\n- **Gastrointestinal protection**: Shown to protect against various GI lesions in animal models\n- **Musculoskeletal repair**: Research suggests potential benefits for muscle, tendon, and bone healing\n- **Neuroprotection**: Some studies indicate protective effects on the nervous system",
      "## Key Publications\n\nOver 100 peer-reviewed studies have been published on BPC-157, primarily in animal models. Key researchers include Dr. Predrag Sikiric and colleagues at the University of Zagreb. Most studies have been conducted in rats and mice.",
      "## Pricing Overview\n\nBPC-157 is one of the most widely available research peptides. On PeptideFind, you can compare prices from multiple vendors to find the best deal. Prices typically range from $25-$90 depending on the quantity and vendor.",
    ],
  },
  "tb500-vs-bpc157": {
    title: "TB-500 vs BPC-157: Research Comparison",
    category: "Peptide Profile",
    readTime: "10 min read",
    content: [
      "TB-500 (Thymosin Beta-4) and BPC-157 are two of the most studied peptides in regenerative research. While they share some overlapping research areas, they have distinct mechanisms and properties.",
      "## TB-500 Overview\n\nTB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring peptide found in virtually all human cells. It plays a role in cell migration, blood vessel formation, and tissue repair.\n\n- **Molecular Weight**: 4,963 Da\n- **Origin**: Synthetic version of naturally occurring Thymosin Beta-4\n- **Key mechanism**: Promotes actin polymerization and cell migration",
      "## BPC-157 Overview\n\nBPC-157 is derived from human gastric juice and has been studied for its protective and regenerative properties.\n\n- **Molecular Weight**: 1,419 Da\n- **Origin**: Partial sequence from human body protection compound\n- **Key mechanism**: Modulates growth factor expression and nitric oxide system",
      "## Research Comparison\n\n| Property | TB-500 | BPC-157 |\n|----------|--------|--------|\n| Source | Thymus gland | Gastric juice |\n| Size | 43 amino acids | 15 amino acids |\n| Stability | Moderate | High (stable in gastric juice) |\n| Primary research | Wound healing, cardiac | GI protection, musculoskeletal |\n| Published studies | ~200+ | ~100+ |",
      "## Pricing on PeptideFind\n\nBoth peptides are widely available from research peptide vendors. Use PeptideFind to compare prices and find the best deals from verified vendors.",
    ],
  },
  "top-vendors-2026": {
    title: "Top 10 Peptide Vendors Reviewed (2026)",
    category: "Vendor Review",
    readTime: "15 min read",
    content: [
      "Choosing the right peptide vendor is crucial for research quality. We've compiled our annual review of the top peptide vendors based on quality testing, pricing, customer service, and community reviews on PeptideFind.",
      "## Our Evaluation Criteria\n\nWe evaluate vendors based on:\n\n- **Product quality**: Purity levels, COA availability, third-party testing\n- **Pricing**: Competitive pricing compared to market averages\n- **Customer service**: Response times, issue resolution, communication\n- **Community reviews**: Ratings and feedback from the PeptideFind community\n- **Shipping**: Speed, packaging quality, and international availability",
      "## How to Use This Guide\n\nThis guide is updated annually based on the latest data from PeptideFind. For real-time pricing and the most current reviews, visit each vendor's profile on PeptideFind.\n\nRemember that all peptides listed on PeptideFind are for research purposes only. Always verify a vendor's current inventory and pricing before placing an order.",
      "## Browse Vendors on PeptideFind\n\nFor the most up-to-date vendor information, ratings, and pricing, visit our Vendor Directory. You can filter by location, lab testing, verification status, and more to find the perfect vendor for your research needs.",
    ],
  },
  "gh-secretagogues": {
    title: "Understanding Growth Hormone Secretagogues",
    category: "Peptide Profile",
    readTime: "10 min read",
    content: [
      "Growth Hormone Secretagogues (GHS) are a class of compounds that stimulate the release of growth hormone from the pituitary gland. They are widely studied in research settings for their effects on growth hormone release, body composition, and aging.",
      "## Types of GH Secretagogues\n\n### GHRPs (Growth Hormone Releasing Peptides)\n- **GHRP-6**: One of the first GHRPs discovered, stimulates appetite\n- **GHRP-2**: More potent than GHRP-6 with less appetite stimulation\n- **Ipamorelin**: Selective GH release with minimal side effects in studies\n- **Hexarelin**: Most potent GHRP but may affect cortisol and prolactin",
      "### GHRHs (Growth Hormone Releasing Hormones)\n- **Sermorelin**: Analog of natural GHRH (first 29 amino acids)\n- **CJC-1295**: Modified GRF(1-29) with extended half-life\n- **Tesamorelin**: FDA-approved GHRH analog for specific conditions",
      "## Research Applications\n\nGH secretagogues are studied for:\n\n- **Aging research**: Understanding age-related GH decline\n- **Body composition**: Effects on lean mass and fat distribution\n- **Sleep**: Many GHS promote deep sleep in animal models\n- **Recovery**: Potential effects on tissue repair and regeneration",
      "## Pricing on PeptideFind\n\nGH secretagogues like Ipamorelin, Sermorelin, and CJC-1295 are among the most popular peptides on our platform. Compare prices from verified vendors to get the best deals for your research.",
    ],
  },
};

interface GuidePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = guidesContent[params.slug];
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} - PeptideFind Guides`,
    description: guide.content[0]?.slice(0, 160),
  };
}

function renderContent(text: string) {
  // Simple markdown-like rendering
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mb-3 mt-8 text-2xl font-bold">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mb-2 mt-6 text-xl font-semibold">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- **")) {
      const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
      if (match) {
        elements.push(
          <li key={i} className="mb-1 ml-6 list-disc">
            <strong>{match[1]}</strong>
            {match[2] ? `: ${match[2]}` : ""}
          </li>
        );
      }
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="mb-1 ml-6 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (line.startsWith("|")) {
      // Skip table rows for simple rendering - show as text
      elements.push(
        <p key={i} className="font-mono text-sm">
          {line}
        </p>
      );
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
          {line}
        </p>
      );
    }
  }

  return elements;
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guidesContent[params.slug];
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/guides"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <Badge variant="secondary">{guide.category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {guide.readTime}
          </span>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{guide.title}</h1>
      </div>

      <Separator className="mb-8" />

      {/* Content */}
      <article className="prose-custom">
        {guide.content.map((section, idx) => (
          <div key={idx}>{renderContent(section)}</div>
        ))}
      </article>

      <Separator className="my-8" />

      {/* CTA */}
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold">Ready to start comparing?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Use PeptideFind to compare prices from verified vendors.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/search">Search Peptides</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/vendors">Browse Vendors</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
