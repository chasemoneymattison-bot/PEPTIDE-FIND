"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export function AdminReviewRemoveButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this review? This cannot be undone.")) return;

    setRemoving(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Review removed", "success");
        router.refresh();
      } else {
        toast("Failed to remove review", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={handleRemove}
      disabled={removing}
    >
      {removing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Remove"}
    </Button>
  );
}
