import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minPurity = searchParams.get("minPurity");
    const minRating = searchParams.get("minRating");
    const forms = searchParams.get("forms");
    const usBasedOnly = searchParams.get("usBasedOnly");
    const inStockOnly = searchParams.get("inStockOnly");
    const hasLabTesting = searchParams.get("hasLabTesting");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 12;

    const where: Prisma.ProductWhereInput = {};
    const vendorWhere: Prisma.VendorWhereInput = {};

    if (q) {
      where.OR = [
        { peptide: { name: { contains: q, mode: "insensitive" } } },
        { vendor: { name: { contains: q, mode: "insensitive" } } },
        { peptide: { category: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (category) where.peptide = { ...where.peptide as any, category };
    if (minPrice) where.price = { ...where.price as any, gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price as any, lte: Number(maxPrice) };
    if (minPurity) where.purity = { gte: Number(minPurity) };
    if (forms) where.form = { in: forms.split(",") as any[] };
    if (inStockOnly === "true") where.inStock = true;
    if (usBasedOnly === "true") vendorWhere.isUSBased = true;
    if (minRating) vendorWhere.overallRating = { gte: Number(minRating) };
    if (hasLabTesting === "true") vendorWhere.hasLabTesting = true;

    if (Object.keys(vendorWhere).length > 0) where.vendor = vendorWhere;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (sortBy) {
      case "price_asc": orderBy = { price: "asc" }; break;
      case "price_desc": orderBy = { price: "desc" }; break;
      case "rating": orderBy = { vendor: { overallRating: "desc" } }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { vendor: true, peptide: true },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
