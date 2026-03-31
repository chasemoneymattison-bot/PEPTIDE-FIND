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

    // Redirect to affiliate URL, product URL, or vendor website
    const externalUrl = product.affiliateUrl || product.productUrl || product.vendor.website;

    // If there's a real external URL (not example.com), redirect there
    if (externalUrl && !externalUrl.includes("example.com")) {
      return NextResponse.redirect(externalUrl);
    }

    // Otherwise redirect to the vendor profile on PeptideFind
    return NextResponse.redirect(new URL(`/vendor/${product.vendor.slug}`, request.url));
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/search", request.url));
  }
}
