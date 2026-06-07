"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { adminService, Category, Brand, Color } from "@/services/adminService";
import { generateSku } from "@/lib/sku";
import { Step, BasicInfo, ProductVariantDraft } from "@/types/product";

export function useNewProduct() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [activeStep, setActiveStep] = useState<Step>("basic");
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const [basicInfo, setBasicInfoState] = useState<BasicInfo>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    gender: "UNISEX",
    status: "ACTIVE",
    isFeatured: false,
  });

  const [variants, setVariants] = useState<ProductVariantDraft[]>([]);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, brandsRes, colorsRes] = await Promise.all([
          adminService.getCategories({ size: 1000 }),
          adminService.getBrands({ size: 100 }),
          adminService.getColors(),
        ]);
        const catsData = catsRes.data;
        setCategories(Array.isArray(catsData) ? catsData : (catsData?.content ?? []));
        setBrands(brandsRes.data.content ?? []);
        setColors(colorsRes.data ?? []);
      } catch (error) {
        console.error("Failed to fetch form data", error);
      }
    };
    fetchData();
  }, []);

  const setBasicInfo = (patch: Partial<BasicInfo>) =>
    setBasicInfoState(prev => ({ ...prev, ...patch }));

  const buildSku = (colorId: string | number, size: string) => {
    const brand = brands.find(b => String(b.id) === String(basicInfo.brandId));
    const category = categories.find(c => String(c.id) === String(basicInfo.categoryId));
    const color = colors.find(c => String(c.id) === String(colorId));
    if (!brand || !category) return "";
    return generateSku(brand.slug, category.slug, color?.name ?? "", size);
  };

  const handleCreateBasic = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminService.createProduct({
        ...basicInfo,
        categoryId: Number(basicInfo.categoryId),
        brandId: Number(basicInfo.brandId),
      });
      setCreatedProductId(response.data.id);
      setActiveStep("variants");
      toast.success("Basic info saved successfully!");
    } catch {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    setVariants(p => [...p, { sku: "", size: "", colorId: "", originalPrice: 0, salePrice: null, stockQuantity: 0, status: "ACTIVE" }]);
  };

  const handleAppendVariants = (newOnes: ProductVariantDraft[]) => {
    setVariants(p => [...p, ...newOnes]);
  };

  const handleUpdateVariant = (idx: number, updated: ProductVariantDraft) => {
    setVariants(p => p.map((v, i) => (i === idx ? updated : v)));
  };

  const handleDeleteVariant = (idx: number) => {
    setVariants(p => p.filter((_, i) => i !== idx));
  };

  const handleBulkApply = (field: "originalPrice" | "salePrice" | "stockQuantity", value: number) => {
    setVariants(p => p.map(v => ({ ...v, [field]: value })));
  };

  const handleSaveVariants = async () => {
    if (!createdProductId) return;
    setIsSubmitting(true);
    try {
      await Promise.all(variants.map(v => adminService.createVariant(createdProductId, { ...v, colorId: Number(v.colorId) })));
      setActiveStep("images");
      toast.success("Variants saved successfully!");
    } catch {
      toast.error("Failed to save variants");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !createdProductId) return;
    setIsSubmitting(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await adminService.addImage(createdProductId, fd);
        setImages(prev => [...prev, res.data]);
      }
      toast.success("Images uploaded successfully!");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success("Image deleted successfully!");
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    toast.success("Product created successfully!");
    router.push(`/${lang}/admin/products`);
  };

  const existingSkus = new Set(variants.map(v => v.sku).filter(Boolean));

  return {
    activeStep, setActiveStep,
    createdProductId,
    isSubmitting,
    basicInfo, setBasicInfo,
    variants,
    images,
    colors, categories, brands,
    buildSku,
    existingSkus,
    handleCreateBasic,
    handleAddVariant,
    handleAppendVariants,
    handleUpdateVariant,
    handleDeleteVariant,
    handleBulkApply,
    handleSaveVariants,
    handleImageUpload,
    handleDeleteImage,
    handleFinish,
  };
}
