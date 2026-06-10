"use client";

import { ChevronLeft, Package, Layers, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useEditProduct } from "@/hooks/admin/useEditProduct";
import { ProductStepper } from "@/components/admin/products/shared/ProductStepper";
import { EditBasicInfoStep } from "@/components/admin/products/edit/EditBasicInfoStep";
import { EditVariantsStep } from "@/components/admin/products/edit/EditVariantsStep";
import { EditImagesStep } from "@/components/admin/products/edit/EditImagesStep";

export default function EditProductPage() {
  const router = useRouter();
  const h = useEditProduct();
  const { locale, t } = useTranslation();

  const STEPS = [
    { id: "basic" as const, label: t("admin.productForm.coreSpecs"), icon: Package },
    { id: "variants" as const, label: t("admin.productForm.variantGrid"), icon: Layers },
    { id: "images" as const, label: t("admin.productForm.visualAssets"), icon: ImageIcon },
  ];

  if (h.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-on-surface-variant font-medium">{t("admin.productForm.loadingData")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-outline-variant hover:border-primary hover:text-primary transition-all shadow-sm" onClick={() => router.back()}>
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
              Synchronizing updates for <span className="text-on-surface font-bold">#{h.id} - {h.basicInfo.name}</span>
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] border-outline-variant hover:border-primary transition-all" onClick={h.handleCompleteSync}>
          {t("admin.productForm.finishAndReturn")}
        </Button>
      </div>

      <ProductStepper steps={STEPS} activeStep={h.activeStep} onStepClick={h.setActiveStep} variant="edit" />

      <div className="bg-surface rounded-[2.5rem] border-2 border-outline-variant shadow-xl overflow-hidden min-h-[500px] relative">
        {h.isSubmitting && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-2xl flex items-center gap-4">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="font-bold uppercase tracking-widest text-xs">{t("admin.productForm.syncingBackend")}</span>
            </div>
          </div>
        )}

        {h.activeStep === "basic" && (
          <EditBasicInfoStep basicInfo={h.basicInfo} onChange={h.setBasicInfo} categories={h.categories} brands={h.brands} sizeGroups={h.sizeGroups} isSubmitting={h.isSubmitting} onSubmit={h.handleUpdateBasic} />
        )}
        {h.activeStep === "variants" && (
          <EditVariantsStep
            variants={h.variants} colors={h.colors} buildSku={h.buildSku}
            editingVariantId={h.editingVariantId} editingVariantData={h.editingVariantData} onEditingDataChange={h.setEditingVariantData}
            isAddingVariant={h.isAddingVariant} newVariant={h.newVariant} onNewVariantChange={h.setNewVariant}
            onStartEdit={h.handleStartEditVariant} onSaveEdit={h.handleSaveVariantUpdate}
            onCancelEdit={() => h.setEditingVariantId(null)}
            onDelete={h.handleDeleteVariant}
            onOpenAdd={() => h.setIsAddingVariant(true)} onCloseAdd={() => h.setIsAddingVariant(false)} onConfirmAdd={h.handleAddVariant}
            sizeGroups={h.sizeGroups}
            isBulkAdding={h.isBulkAdding} setIsBulkAdding={h.setIsBulkAdding}
            bulkConfig={h.bulkConfig} setBulkConfig={h.setBulkConfig}
            bulkPreviewVariants={h.bulkPreviewVariants} setBulkPreviewVariants={h.setBulkPreviewVariants}
            onGenerateBulkPreview={h.handleGenerateBulkPreview} onConfirmBulkAdd={h.handleConfirmBulkAdd}
            onBack={() => h.setActiveStep("basic")} onNext={() => h.setActiveStep("images")}
          />
        )}
        {h.activeStep === "images" && (
          <EditImagesStep images={h.images} isSubmitting={h.isSubmitting} onUpload={h.handleImageUpload} onDelete={h.handleDeleteImage} onBack={() => h.setActiveStep("variants")} onComplete={h.handleCompleteSync} />
        )}
      </div>

      <Modal
        isOpen={h.confirmState.isOpen}
        onClose={h.closeConfirm}
        title={h.confirmState.title}
        footer={
          <>
            <Button variant="outline" onClick={h.closeConfirm} className="rounded-xl font-bold h-11">
              {locale === "vi" ? "Hủy" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={h.confirmState.onConfirm} className="rounded-xl font-bold h-11 shadow-md">
              {locale === "vi" ? "Xác nhận" : "Confirm"}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{h.confirmState.message}</p>
      </Modal>
    </div>
  );
}
