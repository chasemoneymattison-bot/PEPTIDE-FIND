"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function NewVendorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    logoUrl: "",
    location: "",
    isUSBased: true,
    hasLabTesting: false,
    hasAffiliateProgram: false,
    affiliateUrl: "",
    subscriptionTier: "FREE",
    isVerified: false,
    isFeatured: false,
  });

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast("Vendor name is required", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        toast("Vendor created successfully!", "success");
        router.push(`/admin/vendors/${data.id}`);
      } else {
        const err = await res.json().catch(() => null);
        toast(err?.error || "Failed to create vendor", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <h1 className="mb-6 text-3xl font-bold">Add New Vendor</h1>

      <form onSubmit={handleCreate} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., PeptideLabs USA"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                placeholder="Brief description of the vendor..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Website</label>
                <Input
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Logo URL</label>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => updateField("logoUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g., San Diego, CA"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Affiliate URL</label>
                <Input
                  value={form.affiliateUrl}
                  onChange={(e) => updateField("affiliateUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Subscription Tier</label>
              <Select
                value={form.subscriptionTier}
                onValueChange={(v) => updateField("subscriptionTier", v)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {[
                { key: "isUSBased", label: "US-Based" },
                { key: "hasLabTesting", label: "Has Lab Testing" },
                { key: "hasAffiliateProgram", label: "Has Affiliate Program" },
                { key: "isVerified", label: "Verified Vendor" },
                { key: "isFeatured", label: "Featured on Homepage" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <Switch
                    checked={(form as any)[key]}
                    onCheckedChange={(v) => updateField(key, v)}
                  />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Plus className="h-4 w-4" />
            {saving ? "Creating..." : "Create Vendor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
