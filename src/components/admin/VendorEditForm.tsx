"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { Save, Trash2 } from "lucide-react";

interface VendorEditFormProps {
  vendor: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
    location: string | null;
    isUSBased: boolean;
    overallRating: number;
    reviewCount: number;
    hasLabTesting: boolean;
    hasAffiliateProgram: boolean;
    affiliateUrl: string | null;
    subscriptionTier: string;
    isVerified: boolean;
    isFeatured: boolean;
    _count: { products: number; reviews: number };
  };
}

export function VendorEditForm({ vendor }: VendorEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: vendor.name,
    description: vendor.description || "",
    website: vendor.website || "",
    logoUrl: vendor.logoUrl || "",
    location: vendor.location || "",
    isUSBased: vendor.isUSBased,
    hasLabTesting: vendor.hasLabTesting,
    hasAffiliateProgram: vendor.hasAffiliateProgram,
    affiliateUrl: vendor.affiliateUrl || "",
    subscriptionTier: vendor.subscriptionTier,
    isVerified: vendor.isVerified,
    isFeatured: vendor.isFeatured,
  });

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast("Vendor updated successfully", "success");
        router.refresh();
      } else {
        toast("Failed to update vendor", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${vendor.name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Vendor deleted", "success");
        router.push("/admin");
      } else {
        toast("Failed to delete vendor", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-3">
        <Badge variant="secondary">{vendor._count.products} products</Badge>
        <Badge variant="secondary">{vendor._count.reviews} reviews</Badge>
        <Badge variant="secondary">Rating: {vendor.overallRating.toFixed(1)}</Badge>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Vendor Name</label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Website</label>
              <Input
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://..."
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

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Vendor
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
