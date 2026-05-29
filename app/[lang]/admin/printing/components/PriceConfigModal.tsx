"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PrintingPriceConfig } from "@/services/adminService";
import { toast } from "sonner";


interface PriceConfigModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly editingPriceConfig: PrintingPriceConfig | null;
  readonly onSave: (data: { type: "TEXT" | "IMAGE", unitPrice: number, description: string }) => Promise<void>;
  readonly isSubmitting: boolean;
}

export default function PriceConfigModal({
  isOpen,
  onClose,
  editingPriceConfig,
  onSave,
  isSubmitting
}: PriceConfigModalProps) {
  const [formData, setFormData] = useState<{
    type: "TEXT" | "IMAGE";
    unitPrice: number;
    description: string;
  }>({
    type: "TEXT",
    unitPrice: 0,
    description: ""
  });

  useEffect(() => {
    if (editingPriceConfig) {
      setFormData({
        type: editingPriceConfig.type,
        unitPrice: editingPriceConfig.unitPrice,
        description: editingPriceConfig.description || ""
      });
    } else {
      setFormData({
        type: "TEXT",
        unitPrice: 0,
        description: ""
      });
    }
  }, [editingPriceConfig, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.unitPrice < 0) {
      toast.error("Unit price must be positive or zero");
      return;
    }
    await onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPriceConfig ? "Sửa đơn giá thành phần" : "Thêm đơn giá thành phần mới"}
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
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Loại thành phần thiết kế</Label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "TEXT" | "IMAGE" })}
            className="h-12 w-full px-4 rounded-xl border border-outline-variant/60 focus:border-primary bg-surface font-lexend font-bold text-sm"
            disabled={editingPriceConfig !== null}
          >
            <option value="TEXT">TEXT (Dòng chữ tùy biến)</option>
            <option value="IMAGE">IMAGE (Hình ảnh / Logo tải lên)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Đơn giá cộng thêm (VND)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-on-surface-variant opacity-60">đ</span>
            <Input 
              type="number"
              value={formData.unitPrice || ""}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
              className="h-12 pl-10 rounded-xl font-mono border-outline-variant/60 focus:border-primary"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mô tả tác dụng</Label>
          <Input 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="e.g. Áp dụng cho mỗi ký tự hoặc dòng chữ thiết kế thêm..."
          />
        </div>
      </form>
    </Modal>
  );
}
