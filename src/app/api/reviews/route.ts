import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  vendorId: z.string(),
  productId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const json = await request.json();
    const data = reviewSchema.parse(json);

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        vendorId: data.vendorId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        body: data.body,
      },
    });

    // Update vendor's average rating
    const avgResult = await prisma.review.aggregate({
      where: { vendorId: data.vendorId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.vendor.update({
      where: { id: data.vendorId },
      data: {
        overallRating: avgResult._avg.rating || 0,
        reviewCount: avgResult._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
