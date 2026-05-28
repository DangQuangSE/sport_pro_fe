"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useCustomizer } from "@/hooks/useCustomizer";
import CustomizerSidebar from "@/components/customizer/CustomizerSidebar";
import CustomizerCanvas from "@/components/customizer/CustomizerCanvas";
import CustomizerBottomBar from "@/components/customizer/CustomizerBottomBar";

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
    handleDragText,
    handleDragImage
  } = useCustomizer();

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
          Initializing Customizer Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
      
      {/* Top Header Navigation */}
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#e2e2e7] shadow-sm flex justify-between items-center px-8 h-20">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-outline-variant hover:border-primary hover:text-primary transition-all shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <span className="text-xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
            SPORT<span className="text-primary">PRO</span>
          </span>
        </div>
        <h2 className="hidden md:block font-lexend font-black uppercase text-sm tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-6 flex items-center gap-2">
          <Wrench size={14} className="text-primary" />
          Trình thiết kế sản phẩm (Nâng cao)
        </h2>
        <div className="text-right text-xs">
          <span className="font-bold text-on-surface-variant uppercase tracking-widest">Active Variant</span>
          <p className="font-black text-primary italic">Sport Pro Premium Shirt</p>
        </div>
      </header>

      {/* Main Workspace Split Screen */}
      <main className="flex-grow pt-20 flex flex-col lg:flex-row max-w-[1280px] mx-auto w-full px-8 gap-8 h-[calc(100vh-80px)] overflow-hidden">
        
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
        handleConfirmAndReturn={handleConfirmAndReturn}
        formatCurrency={formatCurrency}
      />

    </div>
  );
}
