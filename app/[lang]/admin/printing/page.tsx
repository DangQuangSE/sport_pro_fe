"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  Printer, 
  ArrowLeft,
  Save,
  LayoutGrid,
  List,
  Activity,
  Layers,
  DollarSign,
  Type,
  ImageIcon,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PrintingMaterial, PrintingPriceConfig } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrinting } from "@/hooks/admin/usePrinting";

export default function AdminPrintingPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const {
    materials,
    priceConfigs,
    isLoading,
    isSubmitting,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    createPriceConfig,
    updatePriceConfig,
    deletePriceConfig
  } = usePrinting();

  // Active Tab: 'materials' | 'prices'
  const [activeTab, setActiveTab] = useState<"materials" | "prices">("materials");

  // View state: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // --- Material Modal States ---
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<PrintingMaterial | null>(null);
  const [materialFormData, setMaterialFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    isActive: true
  });

  // --- Price Config Modal States ---
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [editingPriceConfig, setEditingPriceConfig] = useState<PrintingPriceConfig | null>(null);
  const [priceFormData, setPriceFormData] = useState<{
    type: "TEXT" | "IMAGE";
    unitPrice: number;
    description: string;
  }>({
    type: "TEXT",
    unitPrice: 0,
    description: ""
  });

  // --- Delete Confirm States ---
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "material" | "price";
    id: number | null;
  }>({
    isOpen: false,
    type: "material",
    id: null
  });

  // --- Material Handlers ---
  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialFormData({ name: "", description: "", basePrice: 0, isActive: true });
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (material: PrintingMaterial) => {
    setEditingMaterial(material);
    setMaterialFormData({
      name: material.name,
      description: material.description || "",
      basePrice: material.basePrice,
      isActive: material.isActive !== undefined ? material.isActive : (material.active !== undefined ? material.active : true)
    });
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (materialFormData.basePrice < 0) {
      alert("Base price must be positive or zero");
      return;
    }

    let result;
    if (editingMaterial) {
      result = await updateMaterial(editingMaterial.id, materialFormData);
    } else {
      result = await createMaterial(materialFormData);
    }

    if (result.success) {
      setIsMaterialModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  // --- Price Config Handlers ---
  const handleOpenAddPrice = () => {
    setEditingPriceConfig(null);
    setPriceFormData({ type: "TEXT", unitPrice: 0, description: "" });
    setIsPriceModalOpen(true);
  };

  const handleOpenEditPrice = (config: PrintingPriceConfig) => {
    setEditingPriceConfig(config);
    setPriceFormData({
      type: config.type,
      unitPrice: config.unitPrice,
      description: config.description || ""
    });
    setIsPriceModalOpen(true);
  };

  const handleSavePriceConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priceFormData.unitPrice < 0) {
      alert("Unit price must be positive or zero");
      return;
    }

    let result;
    if (editingPriceConfig) {
      result = await updatePriceConfig(editingPriceConfig.id, priceFormData);
    } else {
      result = await createPriceConfig(priceFormData);
    }

    if (result.success) {
      setIsPriceModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  // --- Delete Trigger & Confirms ---
  const handleDeleteTrigger = (type: "material" | "price", id: number) => {
    setDeleteConfirm({ isOpen: true, type, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    let result;
    if (deleteConfirm.type === "material") {
      result = await deleteMaterial(deleteConfirm.id);
    } else {
      result = await deletePriceConfig(deleteConfirm.id);
    }

    if (result.success) {
      setDeleteConfirm({ isOpen: false, type: "material", id: null });
    } else {
      alert(result.error);
    }
  };

  // Format VND Helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 }
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
        
        {/* Toggle View & Add Action */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-variant/40 p-1.5 rounded-xl border border-outline-variant/60 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid" 
                  ? "bg-surface text-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="Grid View"
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
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>

          <Button 
            onClick={activeTab === "materials" ? handleOpenAddMaterial : handleOpenAddPrice}
            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-on-primary hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus size={16} />
            {activeTab === "materials" ? "Add Material" : "Add Price Config"}
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-outline-variant gap-6">
        <button
          onClick={() => setActiveTab("materials")}
          className={`pb-4 px-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 relative ${
            activeTab === "materials"
              ? "border-primary text-primary font-black"
              : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
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
            activeTab === "prices"
              ? "border-primary text-primary font-black"
              : "border-transparent text-on-surface-variant hover:text-on-surface font-bold"
          }`}
        >
          <span className="flex items-center gap-2">
            <DollarSign size={14} />
            Đơn giá thành phần ({priceConfigs.length})
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* --- 1. MATERIALS TAB --- */}
        {activeTab === "materials" && (
          <motion.div
            key="materials-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {materials.length === 0 ? (
              <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
                <Layers size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
                No printing materials configured. Click "Add Material" to define one.
              </div>
            ) : viewMode === "grid" ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {materials.map((mat) => {
                  const isActive = mat.isActive !== undefined ? mat.isActive : mat.active;
                  return (
                    <motion.div
                      key={mat.id}
                      variants={itemVariants}
                      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
                      className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col justify-between transition-all group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                            ID: #{mat.id}
                          </span>
                          <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isActive 
                              ? "bg-success/5 text-success border-success/20" 
                              : "bg-error/5 text-error border-error/20"
                          }`}>
                            {isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-lexend font-black text-on-surface text-xl uppercase tracking-tight">
                            {mat.name}
                          </h3>
                          <p className="text-on-surface-variant font-medium text-xs line-clamp-3 min-h-[48px] leading-relaxed">
                            {mat.description || "Không có mô tả chất liệu."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Base Price</p>
                          <p className="font-lexend font-black text-primary text-lg italic">
                            {formatCurrency(mat.basePrice)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
                            onClick={() => handleOpenEditMaterial(mat)}
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all duration-200"
                            onClick={() => handleDeleteTrigger("material", mat.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="bg-surface rounded-[2rem] border-2 border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-variant/30">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Tên chất liệu</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mô tả chi tiết</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Đơn giá gốc</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Trạng thái</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {materials.map((mat) => {
                        const isActive = mat.isActive !== undefined ? mat.isActive : mat.active;
                        return (
                          <tr key={mat.id} className="hover:bg-surface-variant/10 transition-colors group">
                            <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{mat.id}</td>
                            <td className="px-8 py-5 font-lexend font-bold text-on-surface text-base capitalize">{mat.name}</td>
                            <td className="px-8 py-5 text-on-surface-variant text-xs max-w-xs truncate">{mat.description || "N/A"}</td>
                            <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{formatCurrency(mat.basePrice)}</td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isActive ? "bg-success/5 text-success border-success/20" : "bg-error/5 text-error border-error/20"
                              }`}>
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                                  onClick={() => handleOpenEditMaterial(mat)}
                                >
                                  <Edit2 size={15} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                                  onClick={() => handleDeleteTrigger("material", mat.id)}
                                >
                                  <Trash2 size={15} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* --- 2. PRICES TAB --- */}
        {activeTab === "prices" && (
          <motion.div
            key="prices-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {priceConfigs.length === 0 ? (
              <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
                <DollarSign size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
                No element price configurations defined. Click "Add Price Config" to create one.
              </div>
            ) : viewMode === "grid" ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {priceConfigs.map((cfg) => (
                  <motion.div
                    key={cfg.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
                    className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col justify-between transition-all group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                          ID: #{cfg.id}
                        </span>
                        
                        {/* Type Icon Badge */}
                        <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          cfg.type === "TEXT"
                            ? "bg-primary/5 text-primary border-primary/20"
                            : "bg-secondary/5 text-secondary border-secondary/20"
                        }`}>
                          {cfg.type === "TEXT" ? <Type size={11} /> : <ImageIcon size={11} />}
                          {cfg.type}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-lexend font-black text-on-surface text-lg uppercase tracking-tight flex items-center gap-2">
                          Cấu hình {cfg.type === "TEXT" ? "Dòng chữ" : "Logo / Hình ảnh"}
                        </h3>
                        <p className="text-on-surface-variant font-medium text-xs line-clamp-3 min-h-[48px] leading-relaxed">
                          {cfg.description || "Đơn giá in cộng thêm khi tùy chỉnh thiết kế áo."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Unit Price</p>
                        <p className="font-lexend font-black text-primary text-lg italic">
                          {formatCurrency(cfg.unitPrice)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
                          onClick={() => handleOpenEditPrice(cfg)}
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all duration-200"
                          onClick={() => handleDeleteTrigger("price", cfg.id)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-surface rounded-[2rem] border-2 border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-variant/30">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Loại phần tử</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mô tả</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Đơn giá cộng thêm</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {priceConfigs.map((cfg) => (
                        <tr key={cfg.id} className="hover:bg-surface-variant/10 transition-colors group">
                          <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{cfg.id}</td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              cfg.type === "TEXT" ? "bg-primary/5 text-primary border-primary/20" : "bg-secondary/5 text-secondary border-secondary/20"
                            }`}>
                              {cfg.type === "TEXT" ? <Type size={11} /> : <ImageIcon size={11} />}
                              {cfg.type}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-on-surface-variant text-xs">{cfg.description || "N/A"}</td>
                          <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{formatCurrency(cfg.unitPrice)}</td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                                onClick={() => handleOpenEditPrice(cfg)}
                              >
                                <Edit2 size={15} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                                onClick={() => handleDeleteTrigger("price", cfg.id)}
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD/EDIT MATERIAL MODAL --- */}
      <Modal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        title={editingMaterial ? "Sửa chất liệu in" : "Thêm chất liệu in mới"}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsMaterialModalOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveMaterial}
              className="rounded-xl font-bold h-11 shadow-md gap-2 bg-primary text-on-primary hover:bg-primary/95"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveMaterial} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Tên chất liệu in</Label>
            <Input 
              value={materialFormData.name}
              onChange={(e) => setMaterialFormData({ ...materialFormData, name: e.target.value })}
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
                value={materialFormData.basePrice || ""}
                onChange={(e) => setMaterialFormData({ ...materialFormData, basePrice: Number(e.target.value) })}
                className="h-12 pl-10 rounded-xl font-mono border-outline-variant/60 focus:border-primary"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mô tả ngắn</Label>
            <Input 
              value={materialFormData.description}
              onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
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
              checked={materialFormData.isActive}
              onChange={(e) => setMaterialFormData({ ...materialFormData, isActive: e.target.checked })}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD/EDIT PRICE CONFIG MODAL --- */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title={editingPriceConfig ? "Sửa đơn giá thành phần" : "Thêm đơn giá thành phần mới"}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsPriceModalOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSavePriceConfig}
              className="rounded-xl font-bold h-11 shadow-md gap-2 bg-primary text-on-primary hover:bg-primary/95"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </Button>
          </>
        }
      >
        <form onSubmit={handleSavePriceConfig} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Loại thành phần thiết kế</Label>
            <select
              value={priceFormData.type}
              onChange={(e) => setPriceFormData({ ...priceFormData, type: e.target.value as "TEXT" | "IMAGE" })}
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
                value={priceFormData.unitPrice || ""}
                onChange={(e) => setPriceFormData({ ...priceFormData, unitPrice: Number(e.target.value) })}
                className="h-12 pl-10 rounded-xl font-mono border-outline-variant/60 focus:border-primary"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mô tả tác dụng</Label>
            <Input 
              value={priceFormData.description}
              onChange={(e) => setPriceFormData({ ...priceFormData, description: e.target.value })}
              className="h-12 rounded-xl border-outline-variant/60 focus:border-primary"
              placeholder="e.g. Áp dụng cho mỗi ký tự hoặc dòng chữ thiết kế thêm..."
            />
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRM MODAL --- */}
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
