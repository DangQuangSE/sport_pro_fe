"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { adminService, Category, Brand, Color, SizeGroup } from "@/services/adminService";
import { Step, BasicInfo } from "@/types/product";
import { useTranslation } from "@/hooks/useTranslation";
import { generateSku } from "@/lib/sku";
import { getFriendlyErrorMessage } from "@/lib/error-utils";

type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export function useEditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { locale, t } = useTranslation();

  const [activeStep, setActiveStep] = useState<Step>("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const [basicInfo, setBasicInfoState] = useState<BasicInfo>({
    name: "", description: "", categoryId: "", brandId: "", gender: "UNISEX", status: "ACTIVE", isFeatured: false,
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

  const [confirmState, setConfirmState] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [editingVariantData, setEditingVariantData] = useState<any>(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState<any>({ sku: "", size: "", colorId: "", originalPrice: 0, salePrice: null, stockQuantity: 0 });

  // Bulk Variant States
  const [sizeGroups, setSizeGroups] = useState<SizeGroup[]>([]);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({
    selectedColors: [] as number[],
    sizeGroupId: "",
    selectedSizes: [] as string[],
    originalPrice: 0,
    salePrice: null as number | null,
    stockQuantity: 0
  });
  const [bulkPreviewVariants, setBulkPreviewVariants] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catsRes, brandsRes, colorsRes, sizeGroupsRes, productRes] = await Promise.all([
          adminService.getCategories({ size: 1000 }),
          adminService.getBrands({ size: 100 }),
          adminService.getColors(),
          adminService.getSizeGroups(),
          adminService.getProduct(id),
        ]);
        const catsData = catsRes.data;
        const resolvedCats: Category[] = Array.isArray(catsData) ? catsData : (catsData?.content ?? []);
        const resolvedBrands: Brand[] = brandsRes.data.content ?? [];
        setCategories(resolvedCats);
        setBrands(resolvedBrands);
        setColors(colorsRes.data ?? []);
        setSizeGroups(sizeGroupsRes.data ?? []);

        const p = productRes.data;
        setBasicInfoState({
          name: p.name,
          description: p.description || "",
          categoryId: String(p.categoryId || resolvedCats.find(c => c.name === p.categoryName)?.id || ""),
          brandId: String(p.brandId || resolvedBrands.find(b => b.name === p.brandName)?.id || ""),
          gender: p.gender,
          status: p.status || "ACTIVE",
          isFeatured: !!p.isFeatured,
          sizeGroupId: String(p.sizeGroupId || ""),
        });
        setVariants(p.variants);
        setImages(p.images);
      } catch {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const setBasicInfo = (patch: Partial<BasicInfo>) =>
    setBasicInfoState(prev => ({ ...prev, ...patch }));

  const buildSku = (colorId: string | number, size: string) => {
    const brand = brands.find(b => String(b.id) === String(basicInfo.brandId));
    const category = categories.find(c => String(c.id) === String(basicInfo.categoryId));
    const color = colors.find(c => String(c.id) === String(colorId));
    if (!brand || !category) return "";
    return generateSku(brand.slug, category.slug, color?.name ?? "", size);
  };

  const handleUpdateBasic = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.updateProduct(id, { ...basicInfo, categoryId: Number(basicInfo.categoryId), brandId: Number(basicInfo.brandId) });
      setActiveStep("variants");
      toast.success("Core specifications updated!");
    } catch {
      toast.error(t("admin.productForm.failedUpdate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSync = async () => {
    setIsSubmitting(true);
    try {
      await adminService.updateProduct(id, { ...basicInfo, categoryId: Number(basicInfo.categoryId), brandId: Number(basicInfo.brandId) });
      toast.success("Product successfully updated!");
      router.push(`/${locale}/admin/products`);
    } catch {
      toast.error(t("admin.productForm.failedUpdate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditVariant = (v: any) => {
    setEditingVariantId(v.id);
    setEditingVariantData({ sku: v.sku, size: v.size, colorId: v.colorId || "", originalPrice: v.originalPrice, salePrice: v.salePrice, stockQuantity: v.stockQuantity, status: v.status || "ACTIVE" });
  };

  const handleSaveVariantUpdate = async (variantId: number) => {
    setIsSubmitting(true);
    try {
      const payload = { ...editingVariantData, colorId: Number(editingVariantData.colorId) };
      await adminService.updateVariant(variantId, payload);
      const updatedColor = colors.find(c => c.id === payload.colorId);
      setVariants(prev => prev.map(v => v.id === variantId ? { ...v, ...payload, colorName: updatedColor?.name ?? "", colorHex: updatedColor?.hexCode ?? "#000000" } : v));
      setEditingVariantId(null);
      setEditingVariantData(null);
      toast.success("Variant updated successfully!");
    } catch (err: any) {
      toast.error(getFriendlyErrorMessage(err.message || "Failed to update variant", t));
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
          setVariants(prev => prev.filter(v => v.id !== variantId));
          toast.success("Variant deleted successfully!");
        } catch {
          toast.error(t("admin.productForm.failedVariant") || "Failed to delete variant");
        }
      },
    });
  };

  const handleAddVariant = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...newVariant, colorId: Number(newVariant.colorId) };
      const response = await adminService.createVariant(id, payload);
      setVariants(prev => [...prev, response.data]);
      setIsAddingVariant(false);
      setNewVariant({ sku: "", size: "", colorId: "", originalPrice: 0, salePrice: null, stockQuantity: 0 });
      toast.success("Variant added successfully!");
    } catch (err: any) {
      toast.error(getFriendlyErrorMessage(err.message || "Failed to add variant", t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateBulkPreview = () => {
    const { selectedColors, selectedSizes, originalPrice, salePrice, stockQuantity } = bulkConfig;
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 màu sắc và 1 kích thước!");
      return;
    }

    const previewItems: any[] = [];
    selectedColors.forEach(colorId => {
      const colorObj = colors.find(c => c.id === colorId);
      selectedSizes.forEach(size => {
        const sku = buildSku(colorId, size);
        previewItems.push({
          sku,
          size,
          colorId,
          colorName: colorObj?.name || "",
          colorHex: colorObj?.hexCode || "#000000",
          originalPrice,
          salePrice,
          stockQuantity,
          status: "ACTIVE"
        });
      });
    });

    setBulkPreviewVariants(previewItems);
  };

  const handleConfirmBulkAdd = async () => {
    if (bulkPreviewVariants.length === 0) {
      toast.error("Không có biến thể nào để tạo!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = bulkPreviewVariants.map(v => ({
        sku: v.sku,
        size: v.size,
        colorId: Number(v.colorId),
        originalPrice: v.originalPrice,
        salePrice: v.salePrice,
        stockQuantity: v.stockQuantity,
        status: v.status
      }));

      const res = await adminService.createVariantsBatch(id, payload);
      setVariants(prev => [...prev, ...res.data]);
      setIsBulkAdding(false);
      setBulkPreviewVariants([]);
      // Reset config
      setBulkConfig({
        selectedColors: [],
        sizeGroupId: basicInfo.sizeGroupId || "",
        selectedSizes: [],
        originalPrice: 0,
        salePrice: null,
        stockQuantity: 0
      });
      toast.success("Tạo hàng loạt biến thể thành công!");
    } catch (err: any) {
      toast.error(getFriendlyErrorMessage(err.message || "Failed to batch create variants", t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsSubmitting(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await adminService.addImage(id, fd);
        setImages(prev => [...prev, res.data]);
      }
      toast.success("Images uploaded successfully!");
    } catch {
      toast.error("Failed to upload images");
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
          setImages(prev => prev.filter(img => img.id !== imageId));
          toast.success("Image deleted successfully!");
        } catch {
          toast.error("Failed to delete image");
        }
      },
    });
  };

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  return {
    id, locale,
    activeStep, setActiveStep,
    isLoading, isSubmitting,
    categories, brands, colors,
    basicInfo, setBasicInfo,
    buildSku,
    variants, images,
    confirmState, closeConfirm,
    editingVariantId, setEditingVariantId, editingVariantData, setEditingVariantData,
    isAddingVariant, setIsAddingVariant,
    newVariant, setNewVariant,
    // Bulk Variant Props
    sizeGroups,
    isBulkAdding, setIsBulkAdding,
    bulkConfig, setBulkConfig,
    bulkPreviewVariants, setBulkPreviewVariants,
    handleGenerateBulkPreview,
    handleConfirmBulkAdd,
    handleUpdateBasic,
    handleCompleteSync,
    handleStartEditVariant,
    handleSaveVariantUpdate,
    handleDeleteVariant,
    handleAddVariant,
    handleImageUpload,
    handleDeleteImage,
  };
}
