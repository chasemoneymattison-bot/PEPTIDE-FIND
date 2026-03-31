import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const peptides = await prisma.peptide.findMany({
      where: category ? { category } : undefined,
      include: {
        products: {
          select: { id: true, price: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const result = peptides.map((p) => ({
      ...p,
      productCount: p.products.length,
      lowestPrice: p.products.length > 0 ? Math.min(...p.products.map((pr) => pr.price)) : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Peptides fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch peptides" }, { status: 500 });
  }
}
