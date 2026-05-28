"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Package, 
  Layers, 
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Edit2,
  X,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService, Category, Brand } from "@/services/adminService";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Modal } from "@/components/ui/modal";

type Step = "basic" | "variants" | "images";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { locale, t } = useTranslation();

  const [activeStep, setActiveStep] = useState<Step>("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data for selects
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Form States
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    gender: "UNISEX",
    status: "ACTIVE",
    isFeatured: false
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });
  
  // Editing state for variants
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [editingVariantData, setEditingVariantData] = useState<any>(null);

  // Modal/State for adding new variant
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState<any>({
    sku: "",
    size: "",
    colorId: "",
    originalPrice: 0,
    salePrice: null,
    stockQuantity: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catsRes, brandsRes, colorsRes, productRes] = await Promise.all([
          adminService.getCategories({ size: 1000 }),
          adminService.getBrands({ size: 100 }),
          adminService.getColors(),
          adminService.getProduct(id)
        ]);
        
        const catsData = catsRes.data;
        let resolvedCategories: Category[] = [];
        if (Array.isArray(catsData)) {
          resolvedCategories = catsData;
        } else if (catsData && Array.isArray(catsData.content)) {
          resolvedCategories = catsData.content;
        }
        setCategories(resolvedCategories);
        
        const resolvedBrands = brandsRes.data.content || [];
        setBrands(resolvedBrands);
        
        setColors(colorsRes.data || []);
        
        const p = productRes.data;
        setBasicInfo({
          name: p.name,
          description: p.description || "",
          categoryId: String(p.categoryId || resolvedCategories.find(c => c.name === p.categoryName)?.id || ""),
          brandId: String(p.brandId || resolvedBrands.find(b => b.name === p.brandName)?.id || ""),
          gender: p.gender,
          status: p.status || "ACTIVE",
          isFeatured: !!p.isFeatured
        });
        
        setVariants(p.variants);
        setImages(p.images);
      } catch (error) {
        console.error("Failed to fetch product data", error);
        alert("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.updateProduct(id, {
        ...basicInfo,
        categoryId: Number(basicInfo.categoryId),
        brandId: Number(basicInfo.brandId)
      });
      setActiveStep("variants");
    } catch (error) {
      alert(t("admin.productForm.failedUpdate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSync = async () => {
    setIsSubmitting(true);
    try {
      await adminService.updateProduct(id, {
        ...basicInfo,
        categoryId: Number(basicInfo.categoryId),
        brandId: Number(basicInfo.brandId)
      });
      router.push(`/${locale}/admin/products`);
    } catch (error) {
      alert(t("admin.productForm.failedUpdate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...newVariant,
        colorId: Number(newVariant.colorId)
      };
      const response = await adminService.createVariant(id, payload);
      setVariants([...variants, response.data]);
      setIsAddingVariant(false);
      setNewVariant({ sku: "", size: "", colorId: "", originalPrice: 0, salePrice: null, stockQuantity: 0 });
    } catch (error) {
      alert("Failed to add variant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditVariant = (v: any) => {
    setEditingVariantId(v.id);
    setEditingVariantData({
      sku: v.sku,
      size: v.size,
      colorId: v.colorId || "",
      originalPrice: v.originalPrice,
      salePrice: v.salePrice,
      stockQuantity: v.stockQuantity,
      status: v.status || "ACTIVE"
    });
  };

  const handleSaveVariantUpdate = async (variantId: number) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...editingVariantData,
        colorId: Number(editingVariantData.colorId)
      };
      await adminService.updateVariant(variantId, payload);
      const updatedColor = colors.find(c => c.id === payload.colorId);
      setVariants(variants.map(v => v.id === variantId ? { 
        ...v, 
        ...payload,
        colorId: payload.colorId,
        colorName: updatedColor ? updatedColor.name : "",
        colorHex: updatedColor ? updatedColor.hexCode : "#000000"
      } : v));
      setEditingVariantId(null);
      setEditingVariantData(null);
    } catch (error) {
      alert(t("admin.productForm.failedVariant") || "Failed to update variant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVariant = (variantId: number) => {
    setConfirmState({
      isOpen: true,
      title: locale === "vi" ? "Xác nhận xóa biến thể" : "Confirm Delete Variant",
      message: t("admin.productForm.confirmDeleteVariant") || "Are you sure you want to delete this variant?",
      onConfirm: async () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteVariant(variantId);
          setVariants(variants.filter(v => v.id !== variantId));
        } catch (error) {
          alert(t("admin.productForm.failedVariant") || "Failed to delete variant");
        }
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setIsSubmitting(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await adminService.addImage(id, formData);
        setImages(prev => [...prev, response.data]);
      }
    } catch (error) {
      alert("Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = (imageId: number) => {
    setConfirmState({
      isOpen: true,
      title: locale === "vi" ? "Xác nhận xóa hình ảnh" : "Confirm Delete Image",
      message: locale === "vi" ? "Bạn có chắc chắn muốn xóa hình ảnh này không?" : "Are you sure you want to delete this image?",
      onConfirm: async () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        try {
          await adminService.deleteImage(imageId);
          setImages(images.filter(img => img.id !== imageId));
        } catch (error) {
          alert("Failed to delete image");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-on-surface-variant font-medium">{t("admin.productForm.loadingData")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-2xl border-outline-variant hover:border-primary hover:text-primary transition-all shadow-sm"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
              {locale === "vi" ? (
                <>Sửa <span className="text-primary">Sản Phẩm</span></>
              ) : (
                <>Edit <span className="text-primary">Product</span></>
              )}
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1">
              Synchronizing updates for <span className="text-on-surface font-bold">#{id} - {basicInfo.name}</span>
            </p>
          </div>
        </div>
        <Button 
          variant="outline"
          className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] border-outline-variant hover:border-primary transition-all"
          onClick={handleCompleteSync}
        >
          {t("admin.productForm.finishAndReturn")}
        </Button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between bg-surface p-6 rounded-[2rem] border border-outline-variant shadow-sm backdrop-blur-md">
        {[
          { id: "basic", label: t("admin.productForm.coreSpecs"), icon: Package },
          { id: "variants", label: t("admin.productForm.variantGrid"), icon: Layers },
          { id: "images", label: t("admin.productForm.visualAssets"), icon: ImageIcon },
        ].map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          
          return (
            <React.Fragment key={step.id}>
              <button 
                onClick={() => setActiveStep(step.id as Step)}
                className="flex flex-col items-center gap-3 relative z-10 transition-all hover:scale-105"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                  isActive ? "border-primary bg-primary text-on-primary shadow-xl shadow-primary/20" : 
                  "border-outline-variant bg-surface-container text-on-surface-variant"
                )}>
                  <Icon size={24} />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  isActive ? "text-primary" : "text-on-surface-variant"
                )}>{step.label}</span>
              </button>
              {idx < 2 && (
                <div className="flex-grow h-[2px] mx-8 bg-outline-variant relative -top-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-surface rounded-[2.5rem] border-2 border-outline-variant shadow-xl overflow-hidden min-h-[500px] relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-2xl flex items-center gap-4">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="font-bold uppercase tracking-widest text-xs">{t("admin.productForm.syncingBackend")}</span>
            </div>
          </div>
        )}

        {activeStep === "basic" && (
          <form onSubmit={handleUpdateBasic} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.productName")}</Label>
                <Input 
                  className="h-14 rounded-2xl bg-surface-container-highest/30 border-outline-variant focus:border-primary transition-all font-lexend font-bold text-lg shadow-inner"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.description")}</Label>
                <textarea 
                  className="flex min-h-[160px] w-full rounded-2xl border-2 border-outline-variant bg-surface-container-highest/20 px-4 py-3 text-sm font-medium focus:border-primary transition-all shadow-inner outline-none"
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.category")}</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  value={basicInfo.categoryId}
                  onChange={(e) => setBasicInfo({...basicInfo, categoryId: e.target.value})}
                  required
                >
                  <option value="">{t("admin.productForm.selectCategory")}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.brand")}</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  value={basicInfo.brandId}
                  onChange={(e) => setBasicInfo({...basicInfo, brandId: e.target.value})}
                  required
                >
                  <option value="">{t("admin.productForm.selectBrand")}</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.gender")}</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  value={basicInfo.gender}
                  onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})}
                  required
                >
                  <option value="MALE">{locale === "vi" ? "Nam" : "Male"}</option>
                  <option value="FEMALE">{locale === "vi" ? "Nữ" : "Female"}</option>
                  <option value="UNISEX">{locale === "vi" ? "Unisex" : "Unisex"}</option>
                </select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.status")}</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  value={basicInfo.status}
                  onChange={(e) => setBasicInfo({...basicInfo, status: e.target.value})}
                  required
                >
                  <option value="ACTIVE">{locale === "vi" ? "Hoạt động (Hiện trên Store)" : "Active (On Store)"}</option>
                  <option value="INACTIVE">{locale === "vi" ? "Tạm ẩn (Không hiện)" : "Inactive (Hidden)"}</option>
                </select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.isFeatured")}</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  value={basicInfo.isFeatured ? "true" : "false"}
                  onChange={(e) => setBasicInfo({...basicInfo, isFeatured: e.target.value === "true"})}
                  required
                >
                  <option value="false">{locale === "vi" ? "Sản phẩm thông thường" : "Standard Product"}</option>
                  <option value="true">{locale === "vi" ? "★ Nổi bật Tuần này (Hiện ở Home Carousel)" : "★ Featured in Home Carousel (Nổi bật Tuần này)"}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-outline-variant">
              <Button type="submit" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-lexend font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20">
                {t("admin.productForm.updateCoreSpecs")}
                <Save size={18} />
              </Button>
            </div>
          </form>
        )}

        {activeStep === "variants" && (
          <div className="p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">{t("admin.productForm.variantInventory")}</h3>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">{t("admin.productForm.manageVariants")}</p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 h-12 px-6 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => setIsAddingVariant(true)}
              >
                <Plus size={16} />
                {t("admin.productForm.injectVariant")}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {variants.map((v) => (
                <div key={v.id} className="group p-6 bg-surface-container/30 rounded-3xl border border-outline-variant transition-all hover:bg-surface-container/50 hover:border-primary/30">
                  {editingVariantId === v.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.sku")}</Label>
                        <Input value={editingVariantData.sku} onChange={(e) => setEditingVariantData({...editingVariantData, sku: e.target.value})} className="rounded-xl h-11 font-mono font-bold" />
                      </div>
                      <div className="space-y-2 md:col-span-1">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
                        <Input value={editingVariantData.size} onChange={(e) => setEditingVariantData({...editingVariantData, size: e.target.value})} className="rounded-xl h-11 font-bold text-center" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
                        <div className="flex items-center gap-2">
                          <select 
                            value={editingVariantData.colorId} 
                            onChange={(e) => setEditingVariantData({...editingVariantData, colorId: e.target.value})}
                            className="flex h-11 flex-grow rounded-xl border-2 border-outline-variant bg-surface px-3 font-bold text-sm outline-none focus:border-primary transition-all"
                          >
                            <option value="">{t("admin.productForm.selectColor")}</option>
                            {colors.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {editingVariantData.colorId && (
                            <div 
                              className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0 shadow-sm animate-in fade-in zoom-in duration-200" 
                              style={{ backgroundColor: colors.find(c => String(c.id) === String(editingVariantData.colorId))?.hexCode || "#000000" }}
                              title={colors.find(c => String(c.id) === String(editingVariantData.colorId))?.name}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.originalPrice")}</Label>
                        <Input type="number" value={editingVariantData.originalPrice} onChange={(e) => setEditingVariantData({...editingVariantData, originalPrice: Number(e.target.value)})} className="rounded-xl h-11 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.salePrice")}</Label>
                        <Input type="number" placeholder={t("admin.productForm.noDiscount")} value={editingVariantData.salePrice ?? ""} onChange={(e) => setEditingVariantData({...editingVariantData, salePrice: e.target.value === "" ? null : Number(e.target.value)})} className="rounded-xl h-11 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.stock")}</Label>
                        <Input type="number" value={editingVariantData.stockQuantity} onChange={(e) => setEditingVariantData({...editingVariantData, stockQuantity: Number(e.target.value)})} className="rounded-xl h-11 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div className="flex items-center justify-end gap-1.5 md:col-span-1 pb-[2px]">
                        <Button 
                          size="icon" 
                          type="button"
                          className="h-10 w-10 rounded-xl bg-primary flex-shrink-0"
                          onClick={() => handleSaveVariantUpdate(v.id)}
                        >
                          <Save size={16} />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon" 
                          type="button"
                          className="h-10 w-10 rounded-xl flex-shrink-0"
                          onClick={() => setEditingVariantId(null)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
                      <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">SKU</Label>
                          <p className="font-mono font-bold text-sm">{v.sku}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Attributes</Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold border-outline-variant">{v.size}</Badge>
                            <Badge variant="outline" className="font-bold border-outline-variant gap-1.5 pl-1.5">
                              <span className="w-3.5 h-3.5 rounded-full border border-outline-variant/30 flex-shrink-0" style={{ backgroundColor: v.colorHex || "#000000" }} />
                              {v.colorName}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Price</Label>
                          <div className="flex flex-col">
                            {v.salePrice && v.originalPrice > v.salePrice ? (
                              <>
                                <span className="font-lexend font-black text-primary">{v.salePrice.toLocaleString()} đ</span>
                                <span className="text-[10px] line-through text-on-surface-variant/40 font-normal">{v.originalPrice.toLocaleString()} đ</span>
                              </>
                            ) : (
                              <span className="font-lexend font-black text-on-surface">{v.originalPrice.toLocaleString()} đ</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Stock</Label>
                          <Badge 
                            variant={v.stockQuantity > 10 ? "default" : "destructive"}
                            className="font-black text-[10px]"
                          >
                            {v.stockQuantity} UNITS
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                          onClick={() => handleStartEditVariant(v)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                          onClick={() => handleDeleteVariant(v.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAddingVariant && (
              <div className="p-8 bg-surface-container-highest/20 rounded-[2rem] border-2 border-dashed border-primary/30 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary italic">{t("admin.productForm.newVariantConfig")}</h4>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingVariant(false)}>
                    <X size={20} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">SKU</Label>
                    <Input value={newVariant.sku} onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
                    <Input value={newVariant.size} onChange={(e) => setNewVariant({...newVariant, size: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={newVariant.colorId} 
                        onChange={(e) => setNewVariant({...newVariant, colorId: e.target.value})}
                        className="flex h-11 flex-grow rounded-xl border-2 border-outline-variant bg-surface px-3 font-bold text-sm outline-none focus:border-primary transition-all"
                      >
                        <option value="">{t("admin.productForm.selectColor")}</option>
                        {colors.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {newVariant.colorId && (
                        <div 
                          className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0 shadow-sm animate-in fade-in zoom-in duration-200" 
                          style={{ backgroundColor: colors.find(c => String(c.id) === String(newVariant.colorId))?.hexCode || "#000000" }}
                          title={colors.find(c => String(c.id) === String(newVariant.colorId))?.name}
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">Orig. Price</Label>
                    <Input type="number" value={newVariant.originalPrice} onChange={(e) => setNewVariant({...newVariant, originalPrice: Number(e.target.value)})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">Sale Price</Label>
                    <Input type="number" placeholder="No discount" value={newVariant.salePrice ?? ""} onChange={(e) => setNewVariant({...newVariant, salePrice: e.target.value === "" ? null : Number(e.target.value)})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-60">Stock</Label>
                    <Input type="number" value={newVariant.stockQuantity} onChange={(e) => setNewVariant({...newVariant, stockQuantity: Number(e.target.value)})} className="rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleAddVariant} className="bg-primary hover:bg-primary/90 rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-8">
                    {t("admin.productForm.confirmSaveVariant")}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-outline-variant">
              <Button variant="outline" onClick={() => setActiveStep("basic")} className="rounded-xl font-bold">{t("admin.productForm.back")}</Button>
              <Button onClick={() => setActiveStep("images")} className="rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-on-secondary">{t("admin.productForm.nextAssets")}</Button>
            </div>
          </div>
        )}

        {activeStep === "images" && (
          <div className="p-10 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Visual Assets</h3>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">High-fidelity product imagery and branding</p>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  id="image-upload" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <Button 
                  asChild
                  className="gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  <label htmlFor="image-upload">
                    <Upload size={16} />
                    Upload Assets
                  </label>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-[1.5rem] border-2 border-outline-variant overflow-hidden bg-surface-container shadow-sm hover:border-primary/50 transition-all">
                  <img 
                    src={img.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="rounded-xl h-10 w-10 shadow-xl"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  {img.isThumbnail && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border-none">Main Asset</Badge>
                    </div>
                  )}
                </div>
              ))}
              
              <label 
                htmlFor="image-upload"
                className="aspect-square rounded-[1.5rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Add Asset</span>
              </label>
            </div>

            <div className="flex justify-between pt-10 border-t border-outline-variant">
              <Button variant="outline" onClick={() => setActiveStep("variants")} className="rounded-xl font-bold h-12 px-8">{t("admin.productForm.back")}</Button>
              <Button 
                className="h-14 px-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-black uppercase tracking-widest text-xs shadow-lg shadow-secondary/20"
                onClick={handleCompleteSync}
              >
                {t("admin.productForm.completeSync")}
                <CheckCircle2 size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
              className="rounded-xl font-bold h-11"
            >
              {locale === "vi" ? "Hủy" : "Cancel"}
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmState.onConfirm}
              className="rounded-xl font-bold h-11 shadow-md"
            >
              {locale === "vi" ? "Xác nhận" : "Confirm"}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
          {confirmState.message}
        </p>
      </Modal>
    </div>
  );
}
