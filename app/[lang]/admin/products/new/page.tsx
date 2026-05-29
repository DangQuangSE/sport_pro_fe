"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
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
    gender: "UNISEX",
    status: "ACTIVE",
    isFeatured: false
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, brandsRes, colorsRes] = await Promise.all([
          adminService.getCategories({ size: 1000 }),
          adminService.getBrands({ size: 100 }),
          adminService.getColors()
        ]);
        
        const catsData = catsRes.data;
        if (Array.isArray(catsData)) {
          setCategories(catsData);
        } else if (catsData && Array.isArray(catsData.content)) {
          setCategories(catsData.content);
        } else {
          setCategories([]);
        }
        
        setBrands(brandsRes.data.content);
        setColors(colorsRes.data || []);
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
      toast.success("Basic info saved successfully!");
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, {
      sku: `${basicInfo.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      size: "",
      colorId: "",
      originalPrice: 0,
      salePrice: null,
      stockQuantity: 0
    }]);
  };

  const handleSaveVariants = async () => {
    if (!createdProductId) return;
    setIsSubmitting(true);
    try {
      await Promise.all(variants.map(v => adminService.createVariant(createdProductId, {
        ...v,
        colorId: Number(v.colorId)
      })));
      setActiveStep("images");
      toast.success("Variants saved successfully!");
    } catch (error) {
      toast.error("Failed to save variants");
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
        const response = await adminService.addImage(createdProductId, formData);
        setImages(prev => [...prev, response.data]);
      }
      toast.success("Images uploaded successfully!");
    } catch (error) {
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
      setImages(images.filter(img => img.id !== imageId));
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image");
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
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Inventory Status</Label>
                <select 
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={basicInfo.status}
                  onChange={(e) => setBasicInfo({...basicInfo, status: e.target.value})}
                >
                  <option value="ACTIVE">Active (On Store)</option>
                  <option value="INACTIVE">Inactive (Hidden)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isFeatured">Featured Promotion</Label>
                <select 
                  id="isFeatured"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={basicInfo.isFeatured ? "true" : "false"}
                  onChange={(e) => setBasicInfo({...basicInfo, isFeatured: e.target.value === "true"})}
                >
                  <option value="false">Standard Product</option>
                  <option value="true">★ Featured Product (Nổi bật Tuần này)</option>
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
                  <div key={idx} className="p-4 bg-surface-variant/30 rounded-2xl border border-outline-variant grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
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
                      <Label className="text-[10px] uppercase">{lang === "vi" ? "MÀU SẮC" : "COLOR"}</Label>
                      <div className="flex items-center gap-2">
                        <select 
                          value={v.colorId} 
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[idx].colorId = e.target.value;
                            setVariants(newV);
                          }}
                          className="flex h-10 flex-grow rounded-md border-2 border-outline-variant bg-surface px-3 font-bold text-xs outline-none focus:border-primary transition-all"
                        >
                          <option value="">{lang === "vi" ? "Chọn màu" : "Select Color"}</option>
                          {colors.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {v.colorId && (
                          <div 
                            className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0 shadow-sm animate-in fade-in zoom-in duration-200" 
                            style={{ backgroundColor: colors.find(c => String(c.id) === String(v.colorId))?.hexCode || "#000000" }}
                            title={colors.find(c => String(c.id) === String(v.colorId))?.name}
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Original Price</Label>
                      <Input type="number" value={v.originalPrice} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].originalPrice = Number(e.target.value);
                        setVariants(newV);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Sale Price</Label>
                      <Input type="number" placeholder="No discount" value={v.salePrice ?? ""} onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].salePrice = e.target.value === "" ? null : Number(e.target.value);
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
          <div className="p-8 space-y-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <ImageIcon size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Upload Product Images</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto text-xs font-medium uppercase tracking-wider">
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

            {images.length > 0 && (
              <div className="w-full max-w-2xl mt-6">
                <h4 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-4 text-left">Uploaded Assets ({images.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square rounded-2xl border-2 border-outline-variant overflow-hidden bg-surface-container shadow-sm hover:border-primary/50 transition-all">
                      <img 
                        src={img.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="rounded-xl h-8 w-8 shadow-xl"
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      {img.isThumbnail && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border-none">Main</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Loader2 size={16} className="animate-spin" />
                Processing assets, please wait...
              </div>
            )}

            <div className="flex justify-between w-full pt-8 border-t border-outline-variant mt-8">
              <Button variant="outline" onClick={() => setActiveStep("variants")} className="rounded-xl font-bold">Back</Button>
              <Button 
                onClick={() => {
                  toast.success("Product created successfully!");
                  router.push(`/${lang}/admin/products`);
                }}
                disabled={isSubmitting}
                className="rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 px-8"
              >
                {images.length > 0 ? "Finish & Complete" : "Skip & Finish"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
