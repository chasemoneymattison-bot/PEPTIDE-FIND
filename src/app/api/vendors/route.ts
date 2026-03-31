import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: { select: { products: true, reviews: true } },
      },
      orderBy: { overallRating: "desc" },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Vendors fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
