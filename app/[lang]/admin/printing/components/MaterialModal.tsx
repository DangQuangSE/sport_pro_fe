"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PrintingMaterial } from "@/services/adminService";
import { toast } from "sonner";


interface MaterialModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly editingMaterial: PrintingMaterial | null;
  readonly onSave: (data: { name: string, description: string, basePrice: number, isActive: boolean }) => Promise<void>;
  readonly isSubmitting: boolean;
}

export default function MaterialModal({
  isOpen,
  onClose,
  editingMaterial,
  onSave,
  isSubmitting
}: MaterialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    isActive: true
  });

  useEffect(() => {
    if (editingMaterial) {
      setFormData({
        name: editingMaterial.name,
        description: editingMaterial.description || "",
        basePrice: editingMaterial.basePrice,
        isActive: editingMaterial.isActive !== undefined ? editingMaterial.isActive : (editingMaterial.active !== undefined ? editingMaterial.active : true)
      });
    } else {
      setFormData({
        name: "",
        description: "",
        basePrice: 0,
        isActive: true
      });
    }
  }, [editingMaterial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.basePrice < 0) {
      toast.error("Base price must be positive or zero");
      return;
    }
    await onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMaterial ? "Sửa chất liệu in" : "Thêm chất liệu in mới"}
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="rounded-xl font-bold h-11 shadow-md gap-2 bg-primary text-on-primary hover:bg-primary/95"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Tên chất liệu in</Label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="e.g. In nhiệt cao cấp, In Decal phản quang"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Đơn giá gốc (VND)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-on-surface-variant opacity-60">đ</span>
            <Input 
              type="number"
              value={formData.basePrice || ""}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              className="h-12 pl-10 rounded-xl font-mono border-outline-variant/60 focus:border-primary"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mô tả ngắn</Label>
          <Input 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="Nhập ghi chú hoặc giới thiệu về chất liệu in..."
          />
        </div>

        <div className="flex items-center justify-between bg-surface-variant/20 border border-outline-variant/50 p-4 rounded-2xl">
          <div>
            <h4 className="font-lexend font-bold text-on-surface text-sm">Trạng thái kích hoạt</h4>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Chỉ những chất liệu ở trạng thái hoạt động mới được hiển thị trên editor.</p>
          </div>
          <input 
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>
      </form>
    </Modal>
  );
}
