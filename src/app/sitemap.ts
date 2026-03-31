import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peptidefind.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/vendors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic peptide pages
  const peptides = await prisma.peptide.findMany({
    select: { slug: true, updatedAt: true },
  });

  const peptidePages: MetadataRoute.Sitemap = peptides.map((p) => ({
    url: `${baseUrl}/peptide/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic vendor pages
  const vendors = await prisma.vendor.findMany({
    select: { slug: true, updatedAt: true },
  });

  const vendorPages: MetadataRoute.Sitemap = vendors.map((v) => ({
    url: `${baseUrl}/vendor/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...peptidePages, ...vendorPages];
}
