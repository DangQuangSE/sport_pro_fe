"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

interface Font {
  id: number;
  name: string;
  displayName: string;
}

interface FontModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly editingFont: Font | null;
  readonly onSave: (data: { name: string, displayName: string }) => void;
}

export default function FontModal({
  isOpen,
  onClose,
  editingFont,
  onSave
}: FontModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: ""
  });

  useEffect(() => {
    if (editingFont) {
      setFormData({
        name: editingFont.name,
        displayName: editingFont.displayName
      });
    } else {
      setFormData({
        name: "",
        displayName: ""
      });
    }
  }, [editingFont, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.displayName) {
      alert("Please fill all fields");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingFont ? "Sửa Font chữ in" : "Thêm Font chữ in mới"}
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="rounded-xl font-bold h-11 shadow-md gap-2 bg-primary text-on-primary hover:bg-primary/95"
          >
            <Save size={16} />
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Tên hiển thị</Label>
          <Input 
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="e.g. Montserrat (Trẻ trung), Oswald (Khỏe khoắn)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mã Font Family (CSS name)</Label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
            placeholder="e.g. Montserrat, Oswald, Playfair Display"
            required
          />
        </div>

        <div className="bg-surface-variant/20 rounded-2xl border border-outline-variant/50 p-4 space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Real-time Font Preview</Label>
          <div className="bg-surface p-4 rounded-xl border border-outline-variant/60 text-center min-h-[50px] flex items-center justify-center">
            <span style={{ fontFamily: formData.name || "sans-serif" }} className="text-2xl font-bold">
              SPORT PRO 10
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
