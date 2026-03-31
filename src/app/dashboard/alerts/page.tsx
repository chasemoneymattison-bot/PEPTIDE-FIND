import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Price Alerts",
  description: "Manage your peptide price alerts.",
};

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Price Alerts</h1>
          <p className="mt-2 text-muted-foreground">
            Get notified when peptide prices drop below your target price.
          </p>
        </div>
        <Button asChild>
          <Link href="/search">Browse Peptides</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No active alerts</h3>
          <p className="mb-4 text-center text-muted-foreground">
            Visit a peptide page and click &quot;Set Price Alert&quot; to create your
            first alert. We&apos;ll email you when prices drop below your target.
          </p>
          <Button asChild>
            <Link href="/search">Find Peptides</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
