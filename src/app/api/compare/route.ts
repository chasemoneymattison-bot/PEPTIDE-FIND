import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];

    if (ids.length === 0 || ids.length > 4) {
      return NextResponse.json(
        { error: "Please provide 1-4 product IDs" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { vendor: true, peptide: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Compare fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch comparison" }, { status: 500 });
  }
}
