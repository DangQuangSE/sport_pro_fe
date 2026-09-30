"use client";

import React from "react";
import { Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PriceBreakdown {
  readonly materialBasePrice: number;
  readonly textsCount: number;
  readonly materialCost: number;
  readonly logoUnitPrice: number;
  readonly imagesCount: number;
  readonly logoCost: number;
}

interface CustomizerBottomBarProps {
  readonly totalPrice: number;
  readonly printingPrice: number;
  readonly selectedMaterialName: string;
  readonly priceBreakdown: PriceBreakdown;
  readonly handleResetDesign: () => void;
  readonly handleConfirmAndReturn: () => void;
  readonly formatCurrency: (amt: number) => string;
  readonly locale: string;
}

export default function CustomizerBottomBar({
  totalPrice,
  printingPrice,
  selectedMaterialName,
  priceBreakdown,
  handleResetDesign,
  handleConfirmAndReturn,
  formatCurrency,
  locale
}: CustomizerBottomBarProps) {
  const { materialBasePrice, textsCount, materialCost, logoUnitPrice, imagesCount, logoCost } = priceBreakdown;
  return (
    <div className="w-full bg-white border-t border-[#e2e2e7] p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sticky bottom-0 z-40">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-left">
        
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">TỔNG CỘNG SẢN PHẨM</p>
            <h3 className="text-2xl font-black italic text-primary" style={{ fontFamily: 'var(--font-lexend)' }}>
              {formatCurrency(totalPrice)}
            </h3>
          </div>
          <div className="h-10 w-px bg-[#e2e2e7] hidden md:block" />
          <div className="text-[10px] font-semibold text-on-surface-variant max-w-xs leading-relaxed hidden md:block">
            <span className="flex items-center gap-1.5 font-bold uppercase text-primary mb-0.5">
              <Info size={12} /> Giá in thêm: {formatCurrency(printingPrice)}
            </span>
            <span className="block">
              {selectedMaterialName || "in"}: {formatCurrency(materialBasePrice)} × {textsCount} lớp chữ = {formatCurrency(materialCost)}
            </span>
            <span className="block">
              Logo: {formatCurrency(logoUnitPrice)} × {imagesCount} = {formatCurrency(logoCost)}
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="outline"
            onClick={handleResetDesign}
            className="flex-1 md:flex-none h-14 px-8 border-2 border-outline-variant font-lexend font-black uppercase tracking-widest text-xs"
          >
            {locale === "vi" ? "Đặt lại" : "Reset"}
          </Button>
          <Button 
            onClick={handleConfirmAndReturn}
            className="flex-1 md:flex-none h-14 px-8 bg-[#fe9400] hover:bg-[#e08200] text-white font-lexend font-black uppercase tracking-widest text-xs shadow-md gap-2"
          >
            <CheckCircle size={16} />
            {locale === "vi" ? "Xác nhận" : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
