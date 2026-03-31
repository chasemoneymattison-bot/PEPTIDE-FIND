import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          include: { peptide: true },
          orderBy: { price: "asc" },
        },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { products: true, reviews: true } },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Vendor fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}
