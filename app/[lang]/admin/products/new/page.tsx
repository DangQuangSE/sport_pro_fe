"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Package, Layers, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewProduct } from "@/hooks/admin/useNewProduct";
import { ProductStepper } from "@/components/admin/products/shared/ProductStepper";
import { BasicInfoStep } from "@/components/admin/products/create/BasicInfoStep";
import { VariantsStep } from "@/components/admin/products/create/VariantsStep";
import { ImagesStep } from "@/components/admin/products/create/ImagesStep";

const STEPS = [
  { id: "basic" as const, label: "Basic Info", icon: Package },
  { id: "variants" as const, label: "Variants", icon: Layers },
  { id: "images" as const, label: "Images", icon: ImageIcon },
];

export default function NewProductPage() {
  const router = useRouter();
  const hook = useNewProduct();
  const completed = new Set([
    ...(hook.createdProductId ? ["basic" as const] : []),
    ...(hook.activeStep === "images" ? ["variants" as const] : []),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}><ChevronLeft size={20} /></Button>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Create New Product</h2>
          <p className="text-on-surface-variant">Fill in the details to add a new item to your catalog.</p>
        </div>
      </div>

      <ProductStepper steps={STEPS} activeStep={hook.activeStep} completedSteps={completed} />

      <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm overflow-hidden min-h-[400px]">
        {hook.activeStep === "basic" && (
          <BasicInfoStep basicInfo={hook.basicInfo} onChange={hook.setBasicInfo} categories={hook.categories} brands={hook.brands} sizeGroups={hook.sizeGroups} isSubmitting={hook.isSubmitting} onSubmit={hook.handleCreateBasic} />
        )}
        {hook.activeStep === "variants" && (
          <VariantsStep variants={hook.variants} colors={hook.colors} existingSkus={hook.existingSkus} buildSku={hook.buildSku} isSubmitting={hook.isSubmitting} onAppend={hook.handleAppendVariants} onUpdate={hook.handleUpdateVariant} onDelete={hook.handleDeleteVariant} onBulkApply={hook.handleBulkApply} onAddManual={hook.handleAddVariant} onBack={() => hook.setActiveStep("basic")} onSave={hook.handleSaveVariants} sizeGroupId={hook.basicInfo.sizeGroupId} sizeGroups={hook.sizeGroups} />
        )}
        {hook.activeStep === "images" && (
          <ImagesStep images={hook.images} isSubmitting={hook.isSubmitting} onUpload={hook.handleImageUpload} onDelete={hook.handleDeleteImage} onBack={() => hook.setActiveStep("variants")} onFinish={hook.handleFinish} />
        )}
      </div>
    </div>
  );
}
