"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, Wrench } from "lucide-react";
import { CartItemResponse } from "@/services/cartService";

interface CustomDesignInfo {
  printingPrice: number;
  materialName: string;
  designImageUrl: string;
  textsCount: number;
  imagesCount: number;
  customDesignId?: number;
}

interface CartItemsListProps {
  items: CartItemResponse[];
  t: (key: string) => string;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  onRemoveFromCart: (itemId: number) => void;
  customDesign: CustomDesignInfo | null;
  printingCost: number;
  onRemoveDesign: () => void;
  locale: string;
}

export function CartItemsList({
  items,
  t,
  onUpdateQuantity,
  onRemoveFromCart,
  customDesign,
  printingCost,
  onRemoveDesign,
  locale,
}: CartItemsListProps) {
  return (
    <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
      <div className="flex justify-between items-center pb-6 border-b border-[#e2e2e7]">
        <h3
          className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {t("checkout.shoppingCart")}
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
          {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
          {t("checkout.productsCount")}
        </span>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-[#e2e2e7] mt-6">
        {items.map((item) => {
          const hasDesign = !!item.customDesignId && !!customDesign;
          return (
            <div
              key={item.id}
              className="py-6 first:pt-0 last:pb-0 space-y-4 text-left"
            >
              {/* Product main row */}
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-[#e2e2e7] shrink-0">
                  <img
                    src={item.productImageUrl || item.designImageUrl || "/placeholder-product.png"}
                    className="w-full h-full object-contain"
                    alt={item.productName}
                  />
                </div>

                <div className="flex-grow text-left space-y-1 overflow-hidden">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#717786] block">
                    {item.isCustomizable ?? item.customizable ? "CLOTHES" : "SHOES"}
                  </span>
                  <p
                    className="text-sm font-black uppercase truncate text-[#1a1c1f]"
                    style={{ fontFamily: "var(--font-lexend)" }}
                  >
                    {item.productName}
                  </p>
                  <p className="text-[10px] font-bold text-[#717786]">
                    Size: {item.size} / Color: {item.color}
                  </p>
                  {item.customDesignId && item.printingPrice && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-primary/20 mt-1">
                      <Wrench size={10} />
                      <span>
                        Custom In:{" "}
                        {item.printingPrice
                          ? `+${item.printingPrice.toLocaleString('vi-VN')} ₫`
                          : ""}
                      </span>
                    </div>
                  )}

                  {/* Quantity and Erase Panel */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center border border-[#c1c6d7] rounded-full h-8 px-2 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1 &&
                          onUpdateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-[#717786] hover:text-[#1a1c1f] transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-8 text-center text-xs font-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-[#717786] hover:text-[#1a1c1f] transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#717786] hover:text-error transition-colors"
                    >
                      ERASE
                    </button>
                  </div>
                </div>

                <span
                  className="text-base font-black italic text-[#1a1c1f] shrink-0"
                  style={{ fontFamily: "var(--font-lexend)" }}
                >
                  {(item.salePrice * 25000 * item.quantity).toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {/* Nested Custom Design details if applicable */}
              {hasDesign && (
                <div className="ml-4 md:ml-[104px] bg-[#f9f9fe] border border-primary/10 rounded-2xl p-5 space-y-4 relative text-left">
                  {/* Decorative connector line linking product to printing details */}
                  <div className="absolute -left-6 top-8 w-6 h-px border-t border-dashed border-[#c1c6d7] hidden md:block" />
                  
                  <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e7]">
                    <div className="flex items-center gap-2">
                      <Wrench className="text-primary" size={14} />
                      <h4
                        className="text-[11px] font-black uppercase tracking-wider text-[#1a1c1f]"
                        style={{ fontFamily: "var(--font-lexend)" }}
                      >
                        Chi tiết thiết kế in ấn của sản phẩm
                      </h4>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Link
                        href={`/${locale}/customizer`}
                        className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                      >
                        Chỉnh sửa thiết kế
                      </Link>
                      <span className="text-[#e2e2e7] text-xs">|</span>
                      <button
                        type="button"
                        onClick={onRemoveDesign}
                        className="text-[9px] font-black uppercase tracking-widest text-error hover:underline cursor-pointer"
                      >
                        Xóa thiết kế
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    {/* Design Preview Image */}
                    <div className="w-16 h-16 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-1.5 relative overflow-hidden border border-[#e2e2e7] shrink-0 shadow-inner">
                      <img
                        src={customDesign.designImageUrl}
                        className="w-full h-full object-contain"
                        alt="Your Custom Jersey Design"
                      />
                    </div>

                    {/* Breakdown Specifications */}
                    <div className="flex-grow w-full space-y-1 text-[11px] font-semibold text-[#414755] text-left">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-white p-3.5 rounded-xl border border-[#e2e2e7]">
                        <span className="text-[#717786]">Chất liệu tuyển chọn:</span>
                        <span className="text-[#1a1c1f] font-bold uppercase text-right">
                          {customDesign.materialName}
                        </span>

                        <span className="text-[#717786]">Số lớp chữ in thêm:</span>
                        <span className="text-[#1a1c1f] font-bold text-right">
                          {customDesign.textsCount} lớp
                        </span>

                        <span className="text-[#717786]">Số logo tải lên:</span>
                        <span className="text-[#1a1c1f] font-bold text-right">
                          {customDesign.imagesCount} ảnh
                        </span>

                        <span className="text-[#717786]">Tổng cộng chi phí in:</span>
                        <span className="text-primary font-black italic text-right">
                          +{printingCost.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
