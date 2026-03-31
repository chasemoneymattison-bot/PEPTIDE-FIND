import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  vendorId: z.string(),
  peptideId: z.string(),
  price: z.number().positive(),
  currency: z.string().default("USD"),
  quantity: z.number().positive(),
  unit: z.string().default("mg"),
  purity: z.number().min(0).max(100).optional(),
  form: z.enum(["LYOPHILIZED", "PRE_MIXED", "CAPSULE", "NASAL"]).default("LYOPHILIZED"),
  inStock: z.boolean().default(true),
  productUrl: z.string().url().optional(),
  affiliateUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const json = await request.json();

    // Support bulk import
    if (Array.isArray(json)) {
      const products = await prisma.product.createMany({
        data: json.map((item: any) => productSchema.parse(item)),
      });
      return NextResponse.json({ count: products.count }, { status: 201 });
    }

    const data = productSchema.parse(json);
    const product = await prisma.product.create({ data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
