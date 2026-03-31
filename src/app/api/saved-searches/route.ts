import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const savedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  filters: z.record(z.any()),
  alertEnabled: z.boolean().optional(),
  alertFrequency: z.enum(["DAILY", "WEEKLY"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const json = await request.json();
    const data = savedSearchSchema.parse(json);

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: session.user.id,
        name: data.name,
        filters: data.filters,
        alertEnabled: data.alertEnabled || false,
        alertFrequency: data.alertFrequency || "WEEKLY",
      },
    });

    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Saved search creation error:", error);
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const searches = await prisma.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(searches);
  } catch (error) {
    console.error("Saved searches fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch saved searches" }, { status: 500 });
  }
}
