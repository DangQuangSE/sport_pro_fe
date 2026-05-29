"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Color } from "@/services/adminService";
import { toast } from "sonner";


interface ColorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly editingColor: Color | null;
  readonly onSave: (data: { name: string, hexCode: string }) => Promise<void>;
  readonly isSubmitting: boolean;
}

export default function ColorModal({
  isOpen,
  onClose,
  editingColor,
  onSave,
  isSubmitting
}: ColorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    hexCode: "#0058bc"
  });

  useEffect(() => {
    if (editingColor) {
      setFormData({
        name: editingColor.name,
        hexCode: editingColor.hexCode
      });
    } else {
      setFormData({
        name: "",
        hexCode: "#0058bc"
      });
    }
  }, [editingColor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(formData.hexCode)) {
      toast.error("Invalid Hex Code format. Example: #0058bc");
      return;
    }
    await onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingColor ? "Sửa màu sắc in" : "Thêm màu sắc in mới"}
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
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Tên màu sắc</Label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="e.g. Xanh neon, Đỏ đô"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mã màu HEX</Label>
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-on-surface-variant opacity-60">#</span>
              <Input 
                value={formData.hexCode.replace("#", "")}
                onChange={(e) => setFormData({ ...formData, hexCode: "#" + e.target.value })}
                className="h-12 pl-8 rounded-xl font-mono uppercase border-outline-variant/60 focus:border-primary"
                placeholder="HEXCODE"
                maxLength={6}
                required
              />
            </div>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-outline-variant flex-shrink-0 cursor-pointer shadow-inner">
              <input 
                type="color" 
                value={formData.hexCode} 
                onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                className="absolute inset-0 w-full h-full scale-150 cursor-pointer border-none p-0 bg-transparent"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
