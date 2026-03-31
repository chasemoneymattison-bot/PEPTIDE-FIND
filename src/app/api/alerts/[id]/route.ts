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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const alert = await prisma.priceAlert.findUnique({
      where: { id: params.id },
    });

    if (!alert || alert.userId !== session.user.id) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await prisma.priceAlert.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alert deletion error:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
