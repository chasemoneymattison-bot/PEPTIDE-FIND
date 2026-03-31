import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const vendorSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().transform((v) => v || null),
  website: z.string().optional().transform((v) => (v && v.startsWith("http") ? v : null)),
  logoUrl: z.string().optional().transform((v) => (v && v.startsWith("http") ? v : null)),
  location: z.string().optional().transform((v) => v || null),
  isUSBased: z.boolean().optional(),
  hasLabTesting: z.boolean().optional(),
  hasAffiliateProgram: z.boolean().optional(),
  affiliateUrl: z.string().optional().transform((v) => (v && v.startsWith("http") ? v : null)),
  subscriptionTier: z.enum(["FREE", "PRO", "PREMIUM"]).optional(),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

async function isAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const json = await request.json();
    const data = vendorSchema.parse(json);

    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        slug: slugify(data.name),
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Vendor creation error:", error);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
