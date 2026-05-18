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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService, Category, Brand } from "@/services/adminService";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Step = "basic" | "variants" | "images";

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [activeStep, setActiveStep] = useState<Step>("basic");
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
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
    gender: "UNISEX"
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          adminService.getCategories(),
          adminService.getBrands({ size: 100 })
        ]);
        setCategories(catsRes.data);
        setBrands(brandsRes.data.content);
      } catch (error) {
        console.error("Failed to fetch form data", error);
      }
    };
    fetchData();
  }, []);

  const handleCreateBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminService.createProduct({
        ...basicInfo,
        categoryId: Number(basicInfo.categoryId),
        brandId: Number(basicInfo.brandId)
      });
      setCreatedProductId(response.data.id);
      setActiveStep("variants");
    } catch (error) {
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, {
      sku: `${basicInfo.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      size: "",
      color: "",
      originalPrice: 0,
      stockQuantity: 0
    }]);
  };

  const handleSaveVariants = async () => {
    if (!createdProductId) return;
    setIsSubmitting(true);
    try {
      await Promise.all(variants.map(v => adminService.createVariant(createdProductId, v)));
      setActiveStep("images");
    } catch (error) {
      alert("Failed to save variants");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !createdProductId) return;
    const files = Array.from(e.target.files);
    setIsSubmitting(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        await adminService.addImage(createdProductId, formData);
      }
      alert("Product created successfully!");
      router.push(`/${lang}/admin/products`);
    } catch (error) {
      alert("Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Create New Product</h2>
          <p className="text-on-surface-variant">Fill in the details to add a new item to your catalog.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-outline-variant">
        {[
          { id: "basic", label: "Basic Info", icon: Package },
          { id: "variants", label: "Variants", icon: Layers },
          { id: "images", label: "Images", icon: ImageIcon },
        ].map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isDone = (step.id === "basic" && createdProductId) || (step.id === "variants" && activeStep === "images");
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  isActive ? "border-primary bg-primary text-on-primary shadow-lg scale-110" : 
                  isDone ? "border-success bg-success text-on-success" : 
                  "border-outline-variant bg-surface-variant text-on-surface-variant"
                )}>
                  {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isActive ? "text-primary" : "text-on-surface-variant"
                )}>{step.label}</span>
              </div>
              {idx < 2 && (
                <div className="flex-grow h-[2px] mx-4 bg-outline-variant relative -top-3">
                  <div className={cn(
                    "h-full bg-primary transition-all duration-500",
                    isDone ? "w-full" : "w-0"
                  )} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm overflow-hidden min-h-[400px]">
        {activeStep === "basic" && (
          <form onSubmit={handleCreateBasic} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Air Max 270 React" 
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed product description..."
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={basicInfo.categoryId}
                  onChange={(e) => setBasicInfo({...basicInfo, categoryId: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <select 
                  id="brand"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={basicInfo.brandId}
                  onChange={(e) => setBasicInfo({...basicInfo, brandId: e.target.value})}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={basicInfo.gender}
                  onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})}
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="UNISEX">Unisex</option>
                  <option value="KIDS">Kids</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Next: Add Variants
              </Button>
            </div>
          </form>
        )}

        {activeStep === "variants" && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Product Variants</h3>
              <Button variant="outline" size="sm" onClick={handleAddVariant} className="gap-2">
                <Plus size={16} />
                Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant italic">
                No variants added yet. At least one is required.
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div key={idx} className="p-4 bg-surface-variant/30 rounded-2xl border border-outline-variant grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">SKU</Label>
                      <Input value={v.sku} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].sku = e.target.value;
                        setVariants(newV);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Size</Label>
                      <Input placeholder="M, 42..." value={v.size} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].size = e.target.value;
                        setVariants(newV);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Color</Label>
                      <Input placeholder="Red, Blue..." value={v.color} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].color = e.target.value;
                        setVariants(newV);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Price</Label>
                      <Input type="number" value={v.originalPrice} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].originalPrice = Number(e.target.value);
                        setVariants(newV);
                      }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="space-y-1 flex-grow">
                        <Label className="text-[10px] uppercase">Stock</Label>
                        <Input type="number" value={v.stockQuantity} onChange={(e) => {
                          const newV = [...variants];
                          newV[idx].stockQuantity = Number(e.target.value);
                          setVariants(newV);
                        }} />
                      </div>
                      <Button variant="outline" size="icon" className="text-error h-10 w-10 mt-6" onClick={() => setVariants(variants.filter((_, i) => i !== idx))}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveStep("basic")}>Back</Button>
              <Button onClick={handleSaveVariants} disabled={isSubmitting || variants.length === 0} className="gap-2">
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Next: Upload Images
              </Button>
            </div>
          </div>
        )}

        {activeStep === "images" && (
          <div className="p-8 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <ImageIcon size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Upload Product Images</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto">
                Select high-quality images to showcase your product. The first image will be the main thumbnail.
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant rounded-2xl cursor-pointer hover:bg-surface-variant/30 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="text-on-surface-variant mb-2" size={24} />
                  <p className="text-sm text-on-surface-variant">Click to select files</p>
                </div>
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} disabled={isSubmitting} />
              </label>
            </div>

            {isSubmitting && (
              <div className="flex items-center gap-2 text-primary font-medium">
                <Loader2 size={20} className="animate-spin" />
                Uploading images, please wait...
              </div>
            )}

            <div className="flex justify-between w-full pt-8 border-t border-outline-variant mt-8">
              <Button variant="outline" onClick={() => setActiveStep("variants")}>Back</Button>
              <Button variant="outline" onClick={() => router.push(`/${lang}/admin/products`)}>Skip & Finish</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
