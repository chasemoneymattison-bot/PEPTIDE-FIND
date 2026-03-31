"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/toaster";

interface PriceAlertModalProps {
  peptideId: string;
  peptideName: string;
  currentLowestPrice: number;
}

export function PriceAlertButton({
  peptideId,
  peptideName,
  currentLowestPrice,
}: PriceAlertModalProps) {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    Math.floor(currentLowestPrice * 0.9).toString()
  );
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || Number(targetPrice) <= 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peptideId,
          targetPrice: Number(targetPrice),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        toast(`Price alert set for ${peptideName} at $${targetPrice}`, "success");
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 2000);
      } else if (res.status === 401) {
        toast("Please sign in to set price alerts", "error");
        setOpen(false);
      } else {
        toast("Failed to create alert. Try again.", "error");
      }
    } catch {
      toast("Something went wrong. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-4 w-4" />
        Set Price Alert
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <Card className="relative z-10 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Price Alert
              </CardTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Bell className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold">Alert Set!</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll notify you when {peptideName} drops below $
                    {targetPrice}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Get notified when <strong>{peptideName}</strong> drops below
                      your target price.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current lowest: ${currentLowestPrice.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Target Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="1"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-8"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={submitting}
                  >
                    <Bell className="h-4 w-4" />
                    {submitting ? "Setting Alert..." : "Set Price Alert"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    You must be signed in to receive alerts. We&apos;ll send
                    notifications to your email.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
