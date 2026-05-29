"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  Palette,
  ArrowLeft,
  Save,
  LayoutGrid,
  List,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Color } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";
import { useColors } from "@/hooks/admin/useColors";
import { toast } from "sonner";

export default function AdminColorsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const { 
    colors, 
    isLoading, 
    isSubmitting, 
    createColor, 
    updateColor, 
    deleteColor 
  } = useColors();

  // View state: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Form Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    hexCode: "#18181B" // Premium Charcoal Off-Black instead of pure #000000
  });

  // Confirm delete dialog state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    colorId: number | null;
  }>({
    isOpen: false,
    colorId: null
  });

  const handleOpenAdd = () => {
    setEditingColor(null);
    setFormData({ name: "", hexCode: "#18181B" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (color: Color) => {
    setEditingColor(color);
    setFormData({ name: color.name, hexCode: color.hexCode });
    setIsFormOpen(true);
  };

  const handleSaveColor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hex Validation
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(formData.hexCode)) {
      toast.error("Invalid Hex Code format. Example: #18181B");
      return;
    }

    let result;
    if (editingColor) {
      result = await updateColor(editingColor.id, formData);
    } else {
      result = await createColor(formData);
    }

    if (result.success) {
      setIsFormOpen(false);
      toast.success(editingColor ? "Color updated successfully!" : "Color created successfully!");
    } else {
      toast.error(result.error || "Operation failed");
    }
  };

  const handleDeleteTrigger = (id: number) => {
    setConfirmState({ isOpen: true, colorId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmState.colorId) return;
    
    const result = await deleteColor(confirmState.colorId);
    if (result.success) {
      setConfirmState({ isOpen: false, colorId: null });
      toast.success("Color deleted successfully!");
    } else {
      toast.error(t("admin.productForm.failedDeleteColor") || "Failed to delete color.");
    }
  };

  // Motion variants for staggered elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-primary relative z-10" />
          <div className="absolute w-12 h-12 rounded-full border-4 border-primary/20 animate-ping" />
        </div>
        <p className="text-on-surface-variant font-mono font-medium text-sm tracking-wider uppercase">
          {t("admin.colors.loading") || t("admin.productForm.loadingData") || "Loading color swatches..."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-2xl border-outline-variant hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-on-surface uppercase leading-none flex items-center gap-3">
              <Palette className="text-primary h-8 w-8" />
              {t("admin.productForm.manageColors") || "Manage Colors"}
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1.5 leading-relaxed max-w-xl">
              {t("admin.colors.subtitle") || "Configure Swatch colors for product variants"}
            </p>
          </div>
        </div>
        
        {/* Toggle View and Action */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-variant/40 p-1.5 rounded-xl border border-outline-variant/60 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid" 
                  ? "bg-surface text-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title={t("admin.colors.gridView") || "Grid View"}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "table" 
                  ? "bg-surface text-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title={t("admin.colors.tableView") || "Table View"}
            >
              <List size={18} />
            </button>
          </div>

          <Button 
            onClick={handleOpenAdd}
            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-on-primary hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus size={16} />
            {t("admin.productForm.createColor") || "Create Color"}
          </Button>
        </div>
      </div>

      {/* Main Swatch Area */}
      <AnimatePresence mode="wait">
        {colors.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic"
          >
            <Palette size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
            {t("admin.colors.noColors") || "No colors defined yet. Click button above to add one."}
          </motion.div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW WITH VISUAL SWATCH CARDS */
          <motion.div 
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {colors.map((color) => (
              <motion.div
                key={color.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
                }}
                className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col items-center text-center transition-all group overflow-hidden"
              >
                {/* Floating active glow sequence */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* ID badge */}
                <span className="absolute top-4 left-5 font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                  ID: {color.id}
                </span>

                {/* Color Swatch Bubble */}
                <motion.div 
                  className="w-20 h-20 rounded-full border-4 border-surface shadow-md cursor-pointer my-4 flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: color.hexCode }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                </motion.div>

                {/* Color details */}
                <div className="space-y-1.5 z-10 w-full">
                  <h3 className="font-lexend font-bold text-on-surface text-base truncate px-2" title={color.name}>
                    {color.name}
                  </h3>
                  <p className="font-mono font-bold text-primary tracking-wide text-xs">
                    {color.hexCode.toUpperCase()}
                  </p>
                </div>

                {/* Overlay Action Buttons */}
                <div className="flex items-center gap-3 mt-6 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
                    onClick={() => handleOpenEdit(color)}
                    title={t("admin.productForm.editColor") || "Edit"}
                  >
                    <Edit2 size={15} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all duration-200"
                    onClick={() => handleDeleteTrigger(color.id)}
                    title={t("admin.colors.confirm") || "Delete"}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* HIGH-DENSITY TABLE VIEW */
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface rounded-[2rem] border-2 border-outline-variant shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-variant/30">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                      {t("admin.productForm.colorName") || "Color Name"}
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                      {t("admin.productForm.hexCode") || "Hex Code"}
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                      {t("admin.productForm.preview") || "Preview"}
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">
                      {t("admin.productForm.actions") || "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-medium">
                  {colors.map((color) => (
                    <tr key={color.id} className="hover:bg-surface-variant/10 transition-colors group">
                      <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{color.id}</td>
                      <td className="px-8 py-5 font-lexend font-bold text-on-surface text-base">{color.name}</td>
                      <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{color.hexCode.toUpperCase()}</td>
                      <td className="px-8 py-5">
                        <div 
                          className="w-8 h-8 rounded-full border border-outline-variant/60 shadow-inner flex-shrink-0 relative overflow-hidden"
                          style={{ backgroundColor: color.hexCode }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                            onClick={() => handleOpenEdit(color)}
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                            onClick={() => handleDeleteTrigger(color.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingColor ? (t("admin.productForm.editColor") || "Edit Color") : (t("admin.productForm.createColor") || "Create New Color")}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
              disabled={isSubmitting}
            >
              {t("admin.colors.cancel") || "Cancel"}
            </Button>
            <Button 
              onClick={handleSaveColor}
              className="rounded-xl font-bold h-11 shadow-md gap-2 bg-primary text-on-primary hover:bg-primary/95"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {t("admin.colors.save") || "Save"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveColor} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
              {t("admin.productForm.colorName") || "Color Name"}
            </Label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
              placeholder="e.g. Electric Blue, Đỏ Cherry"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
              {t("admin.productForm.hexCode") || "Hex Code"}
            </Label>
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

          {/* REAL-TIME PREVIEW CARD */}
          <div className="bg-surface-variant/20 rounded-2xl border border-outline-variant/50 p-4 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 flex items-center gap-1.5">
              <Activity size={12} className="text-primary animate-pulse" />
              {t("admin.colors.realtimePreview") || "Real-time Swatch Preview"}
            </Label>
            
            <div className="flex items-center gap-4 bg-surface p-3.5 rounded-xl border border-outline-variant/60">
              <div 
                className="w-12 h-12 rounded-full border border-outline-variant/70 shadow-md relative overflow-hidden flex-shrink-0"
                style={{ backgroundColor: formData.hexCode }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
              </div>
              <div className="min-w-0">
                <h4 className="font-lexend font-bold text-on-surface text-sm truncate">
                  {formData.name || "Unnamed Swatch"}
                </h4>
                <p className="font-mono text-xs text-primary font-bold tracking-wider">
                  {formData.hexCode.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, colorId: null })}
        title={t("admin.colors.deleteTitle") || "Confirm Delete Color"}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setConfirmState({ isOpen: false, colorId: null })}
              className="rounded-xl font-bold h-11 border-outline-variant"
              disabled={isSubmitting}
            >
              {t("admin.colors.cancel") || "Cancel"}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl font-bold h-11 shadow-md gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {t("admin.colors.confirm") || "Confirm"}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
          {t("admin.productForm.confirmDeleteColor") || "Are you sure you want to delete this color?"}
        </p>
      </Modal>
    </div>
  );
}
