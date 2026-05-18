"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Brand, BrandRequest } from "@/services/adminService";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: BrandRequest) => Promise<void>;
  readonly initialData: Brand | null;
  readonly brandsCount: number;
  readonly isSubmitting: boolean;
}

export function BrandFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  brandsCount,
  isSubmitting
}: BrandFormModalProps) {
  const [formData, setFormData] = useState<BrandRequest>({
    name: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        displayOrder: initialData.displayOrder,
        isActive: initialData.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        displayOrder: brandsCount + 1,
        isActive: true
      });
    }
  }, [initialData, brandsCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Brand" : "Add New Brand"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Brand"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="brand-name">Brand Name</Label>
          <Input 
            id="brand-name" 
            placeholder="e.g. Nike, Adidas" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand-desc">Description (Optional)</Label>
          <Input 
            id="brand-desc" 
            placeholder="Brief description about the brand..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-surface-variant/20 border-outline-variant"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand-logo">Logo URL</Label>
          <div className="flex gap-3">
            <Input 
              id="brand-logo" 
              placeholder="https://..." 
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="bg-surface-variant/20 border-outline-variant"
            />
            <div className="w-10 h-10 border border-outline-variant rounded-xl flex items-center justify-center bg-white overflow-hidden shadow-inner shrink-0">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-contain p-1" />
              ) : (
                <ImageIcon size={16} className="text-outline" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand-order">Display Order</Label>
          <Input 
            id="brand-order" 
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
            className="bg-surface-variant/20 border-outline-variant"
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50 transition-all hover:bg-surface-variant/50">
          <input 
            type="checkbox" 
            id="brand-active"
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          <Label htmlFor="brand-active" className="cursor-pointer text-sm font-medium">
            Active and visible on storefront
          </Label>
        </div>
      </form>
    </Modal>
  );
}
