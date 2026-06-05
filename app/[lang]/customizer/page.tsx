"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Loader2, CheckCircle2 } from "lucide-react";
import { BRAND_CONFIG } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useCustomizer } from "@/hooks/useCustomizer";
import CustomizerSidebar from "@/components/customizer/CustomizerSidebar";
import CustomizerCanvas from "@/components/customizer/CustomizerCanvas";
import CustomizerBottomBar from "@/components/customizer/CustomizerBottomBar";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export default function ProductCustomizerPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const {
    materials,
    selectedMaterial,
    setSelectedMaterial,
    colors,
    texts,
    images,
    inputText,
    setInputText,
    selectedFont,
    setSelectedFont,
    selectedColor,
    setSelectedColor,
    selectedFontSize,
    setSelectedFontSize,
    activeTextId,
    setActiveTextId,
    handleUpdateText,
    viewSide,
    setViewSide,
    zoomLevel,
    setZoomLevel,
    isLoading,
    totalPrice,
    printingPrice,
    handleAddText,
    handleImageUpload,
    handleRemoveText,
    handleRemoveImage,
    handleResetDesign,
    handleConfirmAndReturn,
    handleSaveDesignAndLinkToCart,
    handleDragText,
    handleDragImage
  } = useCustomizer();

  const params = useParams();
  const locale = (params?.lang as string) || "vi";

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirmClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleSaveAndCheckout = async () => {
    setIsSaving(true);
    const toastId = toast.loading(
      locale === "vi" 
        ? "Đang biên dịch và lưu thiết kế của bạn..." 
        : "Compiling and saving your layout design..."
    );
    try {
      await handleSaveDesignAndLinkToCart();
      toast.success(
        locale === "vi"
          ? "Đã lưu và liên kết thiết kế với giỏ hàng thành công!"
          : "Design saved and linked to your cart successfully!",
        { id: toastId }
      );
      setIsConfirmModalOpen(false);
      router.push(`/${locale}/checkout`);
    } catch (err: any) {
      console.error("Save design failed", err);
      toast.error(
        err.message || (locale === "vi" ? "Lưu thiết kế thất bại. Vui lòng thử lại." : "Failed to save design layout. Please try again."),
        { id: toastId }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Format VND Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-[#f9f9fe]">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="font-mono text-sm tracking-wider uppercase text-on-surface-variant">
          {t("customizer.initializing") || "Initializing Customizer Workspace..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
      
      {/* Top Header Navigation */}
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#e2e2e7] shadow-sm flex justify-between items-center px-4 sm:px-8 h-20">
        <div className="flex items-center gap-3 sm:gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-outline-variant hover:border-primary hover:text-primary transition-all shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <Link
            href={`/${locale}`}
            className="flex items-center hover:opacity-90 transition-opacity animate-fade-in"
          >
            <img
              src={BRAND_CONFIG.logo}
              alt={BRAND_CONFIG.alt}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>
        <h2 className="hidden md:block font-lexend font-black uppercase text-sm tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-6 flex items-center gap-2">
          <Wrench size={14} className="text-primary" />
          Trình thiết kế sản phẩm (Nâng cao)
        </h2>
        <div className="hidden sm:block text-right text-xs">
          <span className="font-bold text-on-surface-variant uppercase tracking-widest">{t("customizer.activeVariant") || "Active Variant"}</span>
          <p className="font-black text-primary italic">Sport Pro Premium Shirt</p>
        </div>
      </header>

      {/* Main Workspace Split Screen */}
      <main className="flex-grow pt-20 flex flex-col-reverse lg:flex-row max-w-[1280px] mx-auto w-full px-4 sm:px-8 gap-6 lg:gap-8 h-[calc(100vh-176px)] lg:h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Left Control Sidebar */}
        <CustomizerSidebar 
          materials={materials}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          colors={colors}
          inputText={inputText}
          setInputText={setInputText}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedFontSize={selectedFontSize}
          setSelectedFontSize={setSelectedFontSize}
          activeTextId={activeTextId}
          setActiveTextId={setActiveTextId}
          handleUpdateText={handleUpdateText}
          handleAddText={handleAddText}
          handleImageUpload={handleImageUpload}
          texts={texts}
          handleRemoveText={handleRemoveText}
          images={images}
          handleRemoveImage={handleRemoveImage}
          formatCurrency={formatCurrency}
        />

        {/* Central Design Canvas */}
        <CustomizerCanvas 
          texts={texts}
          images={images}
          viewSide={viewSide}
          setViewSide={setViewSide}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          handleResetDesign={handleResetDesign}
          onDragText={handleDragText}
          onDragImage={handleDragImage}
          activeTextId={activeTextId}
          setActiveTextId={setActiveTextId}
        />

      </main>

      {/* Bottom Pricing Summary Action Bar */}
      <CustomizerBottomBar 
        totalPrice={totalPrice}
        printingPrice={printingPrice}
        selectedMaterialName={selectedMaterial?.name || "in"}
        handleResetDesign={handleResetDesign}
        handleConfirmAndReturn={handleConfirmClick}
        formatCurrency={formatCurrency}
        locale={locale}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => !isSaving && setIsConfirmModalOpen(false)}
        title={locale === "vi" ? "Xác nhận thiết kế" : "Confirm Custom Design"}
        className="max-w-[440px] text-[#1a1c1f]"
      >
        <div className="space-y-6 text-center">
          {/* Decorative Icon */}
          <div className="relative mx-auto mt-2">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl w-20 h-20 mx-auto" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-[#fe9400] text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/25 relative border border-white/20">
              <Wrench size={22} className="animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h3 className="text-xl font-black italic tracking-tight uppercase leading-none text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
              {locale === "vi" ? "Kiểm tra lại thiết kế?" : "Double check design?"}
            </h3>
            <p className="text-xs text-[#717786] font-medium leading-relaxed px-2">
              {locale === "vi" 
                ? "Vui lòng xem kỹ vị trí in ấn, logo tải lên và chính tả. Thiết kế này sẽ được in ấn chính xác theo những gì bạn thấy." 
                : "Please inspect printing layout, logos and text layers. This design will be produced exactly as shown in the preview."}
            </p>
          </div>

          {/* Specs Card */}
          <div className="bg-[#f9f9fe] rounded-2xl p-4 border border-[#e2e2e7] text-left space-y-2.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#717786] border-b border-[#e2e2e7]/60 pb-2">
              {locale === "vi" ? "Thông tin in ấn" : "Printing Specifications"}
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-[#414755]">
              <span className="text-[#717786]">{locale === "vi" ? "Chất liệu in:" : "Material:"}</span>
              <span className="text-[#1a1c1f] font-bold text-right uppercase">{selectedMaterial?.name || "In chuyển nhiệt"}</span>

              <span className="text-[#717786]">{locale === "vi" ? "Số dòng chữ:" : "Text Layers:"}</span>
              <span className="text-[#1a1c1f] font-bold text-right">{texts.length} {locale === "vi" ? "lớp" : "layers"}</span>

              <span className="text-[#717786]">{locale === "vi" ? "Ảnh logo:" : "Logo Images:"}</span>
              <span className="text-[#1a1c1f] font-bold text-right">{images.length} {locale === "vi" ? "ảnh" : "logos"}</span>
            </div>
          </div>

          {/* Action buttons (vertical layout to prevent horizontal scroll and look extremely sleek) */}
          <div className="flex flex-col gap-2.5">
            <Button
              disabled={isSaving}
              onClick={handleSaveAndCheckout}
              className="w-full h-14 bg-gradient-to-r from-primary to-[#004493] hover:from-[#004493] hover:to-[#003675] text-white font-lexend font-black uppercase text-[10px] tracking-wider rounded-xl shadow-lg shadow-primary/10 transition-all duration-200 gap-2 items-center justify-center flex hover:scale-[1.02]"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              <span>{isSaving ? (locale === "vi" ? "Đang xử lý..." : "Processing...") : (locale === "vi" ? "Xác nhận & Thanh toán" : "Confirm & Pay")}</span>
            </Button>
            <Button
              variant="ghost"
              disabled={isSaving}
              onClick={() => setIsConfirmModalOpen(false)}
              className="w-full h-12 hover:bg-[#f9f9fe] text-[#717786] font-lexend font-black uppercase text-[10px] tracking-wider rounded-xl transition-all duration-200"
            >
              {locale === "vi" ? "Quay lại chỉnh sửa thêm" : "Go Back To Edit"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
