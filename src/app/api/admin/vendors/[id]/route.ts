import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const json = await request.json();
    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: json,
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Vendor update error:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await prisma.vendor.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor deletion error:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
