"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Printer, 
  ArrowLeft,
  LayoutGrid,
  List,
  Layers,
  DollarSign,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrinting } from "@/hooks/admin/usePrinting";
import { useAdminPrintingColors } from "@/hooks/admin/useAdminPrintingColors";
import { useAdminFonts } from "@/hooks/admin/useAdminFonts";
import { toast } from "sonner";

// Extracted Subcomponents & Modals & Utilities
import MaterialsTab from "./components/MaterialsTab";
import PricesTab from "./components/PricesTab";
import ColorsTab from "./components/ColorsTab";
import FontsTab from "./components/FontsTab";
import MaterialModal from "./components/MaterialModal";
import PriceConfigModal from "./components/PriceConfigModal";
import ColorModal from "./components/ColorModal";
import FontModal from "./components/FontModal";
import { formatCurrency, containerVariants, itemVariants } from "./components/printingUtils";

export default function AdminPrintingPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Custom API hooks for printing configurations & colors
  const {
    materials,
    priceConfigs,
    isLoading: isPrintingLoading,
    isSubmitting: isPrintingSubmitting,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    createPriceConfig,
    updatePriceConfig,
    deletePriceConfig
  } = usePrinting();

  // Custom hook for printing-specific colors (BE synced)
  const {
    colors,
    isLoading: isColorsLoading,
    isSubmitting: isColorsSubmitting,
    createColor,
    updateColor,
    deleteColor
  } = useAdminPrintingColors();

  // Custom hook for Font families (local storage synced)
  const {
    fonts,
    isLoading: isFontsLoading,
    addFont,
    updateFont,
    deleteFont
  } = useAdminFonts();

  const isLoading = isPrintingLoading || isColorsLoading || isFontsLoading;
  const isSubmitting = isPrintingSubmitting || isColorsSubmitting;

  // View States
  const [activeTab, setActiveTab] = useState<"materials" | "prices" | "colors" | "fonts">("materials");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal Control States
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);

  const [isFontOpen, setIsFontOpen] = useState(false);
  const [editingFont, setEditingFont] = useState<any>(null);

  // Delete Confirm Dialog State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "material" | "price" | "color" | "font";
    id: number | null;
  }>({
    isOpen: false,
    type: "material",
    id: null
  });

  const handleDeleteTrigger = (type: "material" | "price" | "color" | "font", id: number) => {
    setDeleteConfirm({ isOpen: true, type, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    let result;
    if (deleteConfirm.type === "material") {
      result = await deleteMaterial(deleteConfirm.id);
    } else if (deleteConfirm.type === "price") {
      result = await deletePriceConfig(deleteConfirm.id);
    } else if (deleteConfirm.type === "color") {
      result = await deleteColor(deleteConfirm.id);
    } else if (deleteConfirm.type === "font") {
      deleteFont(deleteConfirm.id);
      result = { success: true };
    }

    if (result && result.success) {
      setDeleteConfirm({ isOpen: false, type: "material", id: null });
      toast.success("Item deleted successfully!");
    } else if (result) {
      toast.error((result as any).error || "Delete operation failed.");
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
          {t("admin.colors.loading") || "Loading printing configurations..."}
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
              <Printer className="text-primary h-8 w-8" />
              {t("admin.sidebar.printing") || "Printing Config"}
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1.5 leading-relaxed max-w-xl">
              Configure baseline printing materials and individual unit pricing for design elements.
            </p>
          </div>
        </div>
        
        {/* Toggle view states and dynamic quick creation buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-variant/40 p-1.5 rounded-xl border border-outline-variant/60 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "table" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>

          <Button 
            onClick={() => {
              if (activeTab === "materials") {
                setEditingMaterial(null);
                setIsMaterialOpen(true);
              } else if (activeTab === "prices") {
                setEditingPrice(null);
                setIsPriceOpen(true);
              } else if (activeTab === "colors") {
                setEditingColor(null);
                setIsColorOpen(true);
              } else if (activeTab === "fonts") {
                setEditingFont(null);
                setIsFontOpen(true);
              }
            }}
            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-on-primary hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus size={16} />
            {activeTab === "materials" 
              ? "Add Material" 
              : activeTab === "prices" 
              ? "Add Price Config"
              : activeTab === "colors"
              ? "Add Color Swatch"
              : "Add Font Family"}
          </Button>
        </div>
      </div>

      {/* Tabs Switcher Navigation Menu */}
      <div className="flex flex-wrap border-b border-outline-variant gap-4 sm:gap-6">
        <button
          onClick={() => setActiveTab("materials")}
          className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 relative ${
            activeTab === "materials" ? "border-primary text-primary font-black" : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers size={14} />
            Chất liệu in ({materials.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("prices")}
          className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 relative ${
            activeTab === "prices" ? "border-primary text-primary font-black" : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
          }`}
        >
          <span className="flex items-center gap-2">
            <DollarSign size={14} />
            Đơn giá thành phần ({priceConfigs.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 relative ${
            activeTab === "colors" ? "border-primary text-primary font-black" : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
          }`}
        >
          <span className="flex items-center gap-2">
            <Printer size={14} />
            Màu sắc in ({colors.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("fonts")}
          className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 relative ${
            activeTab === "fonts" ? "border-primary text-primary font-black" : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
          }`}
        >
          <span className="flex items-center gap-2">
            <Type size={14} />
            Font chữ in ({fonts.length})
          </span>
        </button>
      </div>

      {/* Tab Panels Contents Coordinator */}
      <AnimatePresence mode="wait">
        {activeTab === "materials" && (
          <MaterialsTab 
            materials={materials}
            viewMode={viewMode}
            onEdit={(mat) => { setEditingMaterial(mat); setIsMaterialOpen(true); }}
            onDelete={(id) => handleDeleteTrigger("material", id)}
            formatCurrency={formatCurrency}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        {activeTab === "prices" && (
          <PricesTab 
            priceConfigs={priceConfigs}
            viewMode={viewMode}
            onEdit={(cfg) => { setEditingPrice(cfg); setIsPriceOpen(true); }}
            onDelete={(id) => handleDeleteTrigger("price", id)}
            formatCurrency={formatCurrency}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        {activeTab === "colors" && (
          <ColorsTab 
            colors={colors}
            viewMode={viewMode}
            onEdit={(color) => { setEditingColor(color); setIsColorOpen(true); }}
            onDelete={(id) => handleDeleteTrigger("color", id)}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
        {activeTab === "fonts" && (
          <FontsTab 
            fonts={fonts}
            viewMode={viewMode}
            onEdit={(font) => { setEditingFont(font); setIsFontOpen(true); }}
            onDelete={(id) => handleDeleteTrigger("font", id)}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
      </AnimatePresence>

      {/* --- MODAL FORMS --- */}
      <MaterialModal 
        isOpen={isMaterialOpen}
        onClose={() => setIsMaterialOpen(false)}
        editingMaterial={editingMaterial}
        onSave={async (data) => {
          let res = editingMaterial ? await updateMaterial(editingMaterial.id, data) : await createMaterial(data);
          if (res.success) {
            setIsMaterialOpen(false);
            toast.success(editingMaterial ? "Material updated!" : "Material created!");
          } else {
            toast.error(res.error || "Operation failed");
          }
        }}
        isSubmitting={isSubmitting}
      />

      <PriceConfigModal 
        isOpen={isPriceOpen}
        onClose={() => setIsPriceOpen(false)}
        editingPriceConfig={editingPrice}
        onSave={async (data) => {
          let res = editingPrice ? await updatePriceConfig(editingPrice.id, data) : await createPriceConfig(data);
          if (res.success) {
            setIsPriceOpen(false);
            toast.success(editingPrice ? "Price config updated!" : "Price config created!");
          } else {
            toast.error(res.error || "Operation failed");
          }
        }}
        isSubmitting={isSubmitting}
      />

      <ColorModal 
        isOpen={isColorOpen}
        onClose={() => setIsColorOpen(false)}
        editingColor={editingColor}
        onSave={async (data) => {
          let res = editingColor ? await updateColor(editingColor.id, data) : await createColor(data);
          if (res.success) {
            setIsColorOpen(false);
            toast.success(editingColor ? "Color updated!" : "Color created!");
          } else {
            toast.error(res.error || "Operation failed");
          }
        }}
        isSubmitting={isColorsSubmitting}
      />

      <FontModal 
        isOpen={isFontOpen}
        onClose={() => setIsFontOpen(false)}
        editingFont={editingFont}
        onSave={(data) => {
          if (editingFont) {
            updateFont(editingFont.id, data);
            toast.success("Font updated!");
          } else {
            addFont(data);
            toast.success("Font added!");
          }
          setIsFontOpen(false);
        }}
      />

      {/* --- CONFIRM GLOBAL DELETE MODAL --- */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: "material", id: null })}
        title="Xác nhận xóa"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm({ isOpen: false, type: "material", id: null })}
              className="rounded-xl font-bold h-11 border-outline-variant"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl font-bold h-11 shadow-md gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
          Bạn có chắc chắn muốn xóa cấu hình in ấn này không? Thao tác này sẽ không thể khôi phục lại dữ liệu gốc.
        </p>
      </Modal>
    </div>
  );
}
