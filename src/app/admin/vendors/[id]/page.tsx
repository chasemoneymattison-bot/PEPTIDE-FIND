import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VendorEditForm } from "@/components/admin/VendorEditForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Vendor" };

interface Props {
  params: { id: string };
}

export default async function AdminVendorEditPage({ params }: Props) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { products: true, reviews: true } },
    },
  });

  if (!vendor) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Vendor: {vendor.name}</h1>
      <VendorEditForm vendor={vendor} />
    </div>
  );
}
