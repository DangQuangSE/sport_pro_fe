"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Category, CategoryRequest } from "@/services/adminService";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: CategoryRequest) => Promise<void>;
  readonly initialData: Category | null;
  readonly categories: Category[];
  readonly isSubmitting: boolean;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isSubmitting
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    description: "",
    parentId: undefined,
    displayOrder: 0,
    isActive: true,
    isCustomizable: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        parentId: initialData.parentId || undefined,
        displayOrder: initialData.displayOrder ?? 0,
        isActive: initialData.active ?? initialData.isActive ?? true,
        isCustomizable: initialData.isCustomizable ?? initialData.customizable ?? false,
        customizable: initialData.isCustomizable ?? initialData.customizable ?? false
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parentId: undefined,
        displayOrder: categories.length + 1,
        isActive: true,
        isCustomizable: false,
        customizable: false
      });
    }
  }, [initialData, categories.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Category" : "Add New Category"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Category"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Football Shoes" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input 
            id="description" 
            placeholder="Brief description..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-surface-variant/20 border-outline-variant"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <select 
              id="parentId"
              className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-variant/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              value={formData.parentId || ""}
              onChange={(e) => setFormData({...formData, parentId: e.target.value ? Number(e.target.value) : undefined})}
            >
              <option value="">None (Root)</option>
              {categories.filter(c => c.id !== initialData?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input 
              id="displayOrder" 
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
              className="bg-surface-variant/20 border-outline-variant"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50 transition-all hover:bg-surface-variant/50">
          <input 
            type="checkbox" 
            id="isActive"
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          <Label htmlFor="isActive" className="cursor-pointer text-sm font-medium">
            Active and visible on storefront
          </Label>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50 transition-all hover:bg-surface-variant/50">
          <input 
            type="checkbox" 
            id="isCustomizable"
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
            checked={formData.isCustomizable ?? formData.customizable ?? false}
            onChange={(e) => setFormData({...formData, isCustomizable: e.target.checked, customizable: e.target.checked})}
          />
          <Label htmlFor="isCustomizable" className="cursor-pointer text-sm font-medium">
            Allow Custom Printing / Cho phép in ấn thiết kế
          </Label>
        </div>
      </form>
    </Modal>
  );
}
