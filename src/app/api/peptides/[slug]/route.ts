import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const peptide = await prisma.peptide.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          include: { vendor: true },
          orderBy: { price: "asc" },
        },
      },
    });

    if (!peptide) {
      return NextResponse.json({ error: "Peptide not found" }, { status: 404 });
    }

    return NextResponse.json(peptide);
  } catch (error) {
    console.error("Peptide fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch peptide" }, { status: 500 });
  }
}
