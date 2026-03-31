import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: { vendor: true },
    });

    if (!product) {
      return NextResponse.redirect(new URL("/search", request.url));
    }

    // Log the click
    const session = await getServerSession(authOptions);
    await prisma.clickLog.create({
      data: {
        productId: product.id,
        vendorId: product.vendorId,
        userId: session?.user?.id || null,
      },
    });

    // Redirect to affiliate URL or product URL
    const redirectUrl = product.affiliateUrl || product.productUrl || product.vendor.website || "/search";

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/search", request.url));
  }
}
