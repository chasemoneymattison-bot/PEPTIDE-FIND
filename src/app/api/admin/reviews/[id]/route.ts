import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id: params.id } });

    // Recompute vendor rating
    const avgResult = await prisma.review.aggregate({
      where: { vendorId: review.vendorId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.vendor.update({
      where: { id: review.vendorId },
      data: {
        overallRating: avgResult._avg.rating || 0,
        reviewCount: avgResult._count.rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review deletion error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
