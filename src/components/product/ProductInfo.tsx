"use client";

import { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { PRODUCT_DETAILS } from "@/data/productData";

interface ProductInfoProps {
  product: typeof PRODUCT_DETAILS;
}

export default function ProductInfo({ product }: Readonly<ProductInfoProps>) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(product.colors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="md:col-span-5 flex flex-col">
      {/* Headers & Status */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-[14px] text-primary uppercase tracking-[0.05em]">
          {product.brand}
        </span>
        <span className="flex items-center gap-1 font-bold text-[10px] text-secondary-fixed bg-on-surface px-2 py-1 uppercase tracking-[0.08em] rounded-full">
          <span className="w-1.5 h-1.5 bg-secondary-fixed rounded-full animate-pulse"></span>
          {t("product.details.inStock")}
        </span>
      </div>

      <h1
        className="font-[800] text-[48px] leading-[1.1] text-on-surface uppercase italic mb-4 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        {product.name}
      </h1>

      <div
        className="font-[700] text-[28px] leading-[1.3] text-on-surface mb-8"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        ${product.price.toFixed(2)}
      </div>

      <hr className="border-t border-outline-variant mb-6 opacity-50" />

      {/* Color Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-[0.05em]">
            {t("product.details.color")}
          </span>
          <span className="text-[14px] text-on-surface font-medium">
            {product.colors.find((c) => c.id === selectedColor)?.name}
          </span>
        </div>
        <div className="flex gap-4">
          {product.colors.map((color) => {
            const isActive = selectedColor === color.id;
            return (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                aria-label={color.name}
                className={cn(
                  "w-12 h-12 rounded-full p-0.5 focus:outline-none transition-all",
                  isActive
                    ? "border-2 border-primary ring-2 ring-transparent"
                    : "border-2 border-outline-variant hover:border-on-surface"
                )}
              >
                <span
                  className="block w-full h-full rounded-full shadow-inner"
                  style={{ backgroundColor: color.hex }}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-[0.05em]">
            {t("product.details.sizeUs")}
          </span>
          <a
            href="#"
            className="font-bold text-[10px] text-primary underline underline-offset-4 hover:text-primary-fixed transition-colors tracking-[0.08em]"
          >
            {t("product.details.sizeGuide")}
          </a>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((size) => {
            const isActive = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "py-3 border font-semibold text-[14px] tracking-[0.05em] rounded-xl transition-colors",
                  isActive
                    ? "border-on-surface bg-on-surface text-surface shadow-sm"
                    : "border-outline-variant bg-surface text-on-surface hover:border-on-surface hover:bg-surface-container"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex gap-4 mb-8">
        {/* Quantity */}
        <div className="relative w-24 shrink-0">
          <label className="sr-only" htmlFor="qty">
            {t("product.details.quantity")}
          </label>
          <select
            id="qty"
            className="w-full h-14 appearance-none border border-outline-variant bg-surface text-on-surface text-[16px] px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow rounded-xl"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          className={cn(
            "flex-1 h-14 font-semibold text-[14px] uppercase tracking-[0.05em]",
            "bg-secondary-container text-on-secondary-container",
            "shadow-[0_4px_14px_rgba(254,148,0,0.3)] hover:shadow-[0_6px_20px_rgba(254,148,0,0.4)]",
            "hover:bg-[#ff9f1a] transition-all duration-200 active:scale-[0.98]",
            "flex items-center justify-center gap-2 rounded-xl"
          )}
        >
          {t("product.details.addToCart")}
        </button>

        {/* Wishlist */}
        <button
          aria-label="Add to Wishlist"
          className="w-14 h-14 shrink-0 border border-outline-variant bg-surface text-on-surface-variant hover:text-on-surface hover:border-on-surface flex items-center justify-center transition-all duration-200 rounded-xl"
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Accordions / Information */}
      <div className="border border-outline-variant rounded-xl divide-y divide-outline-variant bg-surface-bright shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <details className="group" open>
          <summary
            className="flex justify-between items-center text-[20px] font-semibold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("product.details.specs")}
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[16px] leading-[1.6]">
            <ul className="space-y-2 list-inside list-disc marker:text-primary">
              <li>Engineered synthetic upper for breathability.</li>
              <li>High-density EVA midsole for maximum impact absorption.</li>
              <li>Asymmetrical lacing system for a locked-in fit.</li>
              <li>Weight: 10.4 oz (Men&apos;s Size 9).</li>
            </ul>
          </div>
        </details>
        <details className="group">
          <summary
            className="flex justify-between items-center text-[20px] font-semibold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("product.details.shippingAndReturns")}
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[16px] leading-[1.6]">
            <p className="mb-2">
              Free standard shipping on orders over $100. Expedited options
              available at checkout.
            </p>
            <p>
              Returns accepted within 30 days of delivery in unworn condition.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
