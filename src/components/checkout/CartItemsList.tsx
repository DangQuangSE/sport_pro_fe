"use client";

import React from "react";
import { Minus, Plus, Wrench } from "lucide-react";
import { CartItemResponse } from "@/services/cartService";

interface CartItemsListProps {
  items: CartItemResponse[];
  t: (key: string) => string;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  onRemoveFromCart: (itemId: number) => void;
}

export function CartItemsList({
  items,
  t,
  onUpdateQuantity,
  onRemoveFromCart,
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
        {items.map((item) => (
          <div
            key={item.id}
            className="py-6 flex gap-6 items-center first:pt-0 last:pb-0"
          >
            <div className="w-20 h-20 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-[#e2e2e7] shrink-0">
              <img
                src={item.designImageUrl || "/placeholder-product.png"}
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
        ))}
      </div>
    </div>
  );
}
