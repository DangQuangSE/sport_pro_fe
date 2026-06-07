"use client";

import { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Brand } from "@/services/adminService";
import { BasicInfo } from "@/types/product";

type Props = {
  basicInfo: BasicInfo;
  onChange: (patch: Partial<BasicInfo>) => void;
  categories: Category[];
  brands: Brand[];
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
};

const selectCls = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function BasicInfoStep({ basicInfo, onChange, categories, brands, isSubmitting, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="e.g. Air Max 270 React" value={basicInfo.name} onChange={e => onChange({ name: e.target.value })} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Detailed product description..."
            value={basicInfo.description}
            onChange={e => onChange({ description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" className={selectCls} value={basicInfo.categoryId} onChange={e => onChange({ categoryId: e.target.value })} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <select id="brand" className={selectCls} value={basicInfo.brandId} onChange={e => onChange({ brandId: e.target.value })} required>
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select id="gender" className={selectCls} value={basicInfo.gender} onChange={e => onChange({ gender: e.target.value })}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Inventory Status</Label>
          <select id="status" className={selectCls} value={basicInfo.status} onChange={e => onChange({ status: e.target.value })}>
            <option value="ACTIVE">Active (On Store)</option>
            <option value="INACTIVE">Inactive (Hidden)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="isFeatured">Featured Promotion</Label>
          <select id="isFeatured" className={selectCls} value={basicInfo.isFeatured ? "true" : "false"} onChange={e => onChange({ isFeatured: e.target.value === "true" })}>
            <option value="false">Standard Product</option>
            <option value="true">★ Featured Product</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Next: Add Variants
        </Button>
      </div>
    </form>
  );
}
