"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Wrench, CheckCircle2, Loader2 } from "lucide-react";
import { CartResponse } from "@/services/cartService";

interface CustomDesignInfo {
  printingPrice: number;
  materialName: string;
  designImageUrl: string;
  textsCount: number;
  imagesCount: number;
}

interface OrderOverviewCardProps {
  cart: CartResponse;
  customDesign: CustomDesignInfo | null;
  printingCost: number;
  estimatedCost: number;
  standardDelivery: number;
  expectedTax: number;
  totalPayment: number;
  isSubmitting: boolean;
  locale: string;
  t: (key: string) => string;
}

export function OrderOverviewCard({
  cart,
  customDesign,
  printingCost,
  estimatedCost,
  standardDelivery,
  expectedTax,
  totalPayment,
  isSubmitting,
  locale,
  t,
}: OrderOverviewCardProps) {
  const router = useRouter();

  return (
    <div className="w-full lg:w-[380px] shrink-0">
      <div className="sticky top-32 space-y-8">
        <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8 space-y-8 text-left">
          <h3
            className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("checkout.orderOverview")}
          </h3>

          {/* Estimated calculation rows */}
          <div className="space-y-4 text-xs font-semibold text-[#414755]">
            <div className="flex justify-between items-center">
              <span>
                {t("checkout.estimated")} (
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                products)
              </span>
              <span className="text-[#1a1c1f]">${estimatedCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>{t("checkout.standardDelivery")}</span>
              <span className="text-[#1a1c1f]">${standardDelivery.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>{t("checkout.expectedTax")}</span>
              <span className="text-[#1a1c1f]">${expectedTax.toLocaleString()}</span>
            </div>

            {customDesign && (
              <div className="space-y-1.5 pt-2 pb-1 border-t border-[#e2e2e7]/60 border-dashed">
                <div className="flex justify-between items-center text-primary font-black">
                  <span>Thiết kế in ({customDesign.materialName})</span>
                  <span>+${printingCost.toFixed(2)}</span>
                </div>
                <div className="bg-[#f9f9fe] p-3 rounded-xl border border-primary/10 text-[10px] font-semibold text-[#717786] space-y-1 leading-relaxed">
                  <p className="font-bold text-primary uppercase text-[8px] tracking-widest mb-1">
                    Chi tiết in ấn
                  </p>
                  <div className="flex justify-between">
                    <span>Chất liệu ({customDesign.materialName}):</span>
                    <span className="font-mono text-[#1a1c1f]">
                      $
                      {(
                        (customDesign.printingPrice -
                          customDesign.textsCount * 10000 -
                          customDesign.imagesCount * 25000) /
                        25000
                      ).toFixed(2)}
                    </span>
                  </div>
                  {customDesign.textsCount > 0 && (
                    <div className="flex justify-between">
                      <span>Lớp chữ ({customDesign.textsCount} lớp):</span>
                      <span className="font-mono text-[#1a1c1f]">
                        +${((customDesign.textsCount * 10000) / 25000).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {customDesign.imagesCount > 0 && (
                    <div className="flex justify-between">
                      <span>Ảnh logo ({customDesign.imagesCount} ảnh):</span>
                      <span className="font-mono text-[#1a1c1f]">
                        +${((customDesign.imagesCount * 25000) / 25000).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-[#e2e2e7] flex justify-between items-center">
              <span className="text-sm font-black uppercase text-[#1a1c1f] tracking-tight">
                {t("checkout.total")}
              </span>
              <span
                className="text-2xl font-black italic tracking-tighter text-[#1a1c1f]"
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                ${totalPayment.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons Action Segment */}
          <div className="space-y-3 pt-4">
            {/* Customize button */}
            <button
              type="button"
              onClick={() => router.push(`/${locale}/customizer`)}
              className="w-full h-14 bg-primary hover:bg-[#004493] text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-primary/10"
            >
              <Wrench size={14} />
              <span>{t("checkout.customizeButton")}</span>
            </button>

            {/* Primary Confirmation button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#fe9400] hover:bg-[#e08200] text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-[#fe9400]/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              <span>
                {isSubmitting ? t("checkout.processing") : t("checkout.confirmButton")}
              </span>
            </button>
          </div>

          {/* Standard Trust Notice */}
          <p className="text-[10px] text-[#717786] font-semibold leading-relaxed text-center pt-2">
            {t("checkout.notice")}
          </p>
        </div>
      </div>
    </div>
  );
}
