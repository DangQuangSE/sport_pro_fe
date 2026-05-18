"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Heart, ShoppingBag, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductDetailResponse, ProductVariantResponse } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductInfoProps {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: Readonly<ProductInfoProps>) {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  // Extract unique colors and sizes from variants
  const availableColors = useMemo(() => {
    const colors = new Set(product.variants.map(v => v.color));
    return Array.from(colors);
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  
  const availableSizes = useMemo(() => {
    return product.variants
      .filter(v => v.color === selectedColor)
      .map(v => v.size);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Find the specific variant based on selections
  const selectedVariant = useMemo(() => {
    return product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
  }, [product.variants, selectedColor, selectedSize]);

  // If only one color, and we just changed color, we might need to reset size if not available
  useMemo(() => {
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [availableSizes, selectedSize]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a size.");
      return;
    }

    try {
      setIsAdding(true);
      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity
      });
      toast.success("Added to Bag!", {
        description: `${product.name} - ${selectedColor}, Size ${selectedSize}`,
        icon: <CheckCircle2 className="text-primary" size={18} />
      });
    } catch (error) {
      toast.error("Failed to add to bag. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const currentPrice = selectedVariant?.salePrice ?? product.variants[0]?.salePrice;
  const originalPrice = selectedVariant?.originalPrice ?? product.variants[0]?.originalPrice;
  const hasDiscount = originalPrice > currentPrice;

  return (
    <div className="flex flex-col">
      {/* Headers & Status */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-[14px] text-primary uppercase tracking-[0.05em]">
          {product.brandName}
        </span>
        <span className="flex items-center gap-1 font-bold text-[10px] text-secondary-fixed bg-on-surface px-2 py-1 uppercase tracking-[0.08em] rounded-full">
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", (selectedVariant?.stockQuantity ?? 1) > 0 ? "bg-secondary-fixed" : "bg-error")}></span>
          {(selectedVariant?.stockQuantity ?? 1) > 0 ? t("product.details.inStock") : "Out of Stock"}
        </span>
      </div>

      <h1
        className="font-[800] text-[48px] leading-[1.1] text-on-surface uppercase italic mb-4 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        {product.name}
      </h1>

      <div className="flex items-baseline gap-4 mb-8">
        <span
          className="font-[700] text-[32px] leading-[1.3] text-on-surface"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          ${currentPrice?.toLocaleString()}
        </span>
        {hasDiscount && (
          <span className="text-xl text-on-surface-variant line-through opacity-50">
            ${originalPrice?.toLocaleString()}
          </span>
        )}
      </div>

      <hr className="border-t border-outline-variant mb-6 opacity-50" />

      {/* Color Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-[0.05em]">
            Select Color
          </span>
          <span className="text-[14px] text-on-surface font-bold uppercase">
            {selectedColor}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => {
            const isActive = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-4 py-2 border font-bold text-[12px] uppercase tracking-widest rounded-xl transition-all",
                  isActive
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                )}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-[0.05em]">
            Select Size
          </span>
          <button className="font-bold text-[10px] text-primary underline underline-offset-4 hover:text-primary-fixed transition-colors tracking-[0.08em]">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((size) => {
            const isActive = selectedSize === size;
            const variantForSize = product.variants.find(v => v.color === selectedColor && v.size === size);
            const isOutOfStock = (variantForSize?.stockQuantity ?? 0) <= 0;

            return (
              <button
                key={size}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "py-3 border font-semibold text-[14px] tracking-[0.05em] rounded-xl transition-all relative overflow-hidden",
                  isActive
                    ? "border-on-surface bg-on-surface text-surface shadow-md"
                    : "border-outline-variant bg-surface text-on-surface hover:border-on-surface hover:bg-surface-container",
                  isOutOfStock && "opacity-20 cursor-not-allowed grayscale"
                )}
              >
                {size}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-on-surface-variant rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4">
          {/* Quantity */}
          <div className="relative w-24 shrink-0">
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-14 appearance-none border border-outline-variant bg-surface text-on-surface text-[16px] px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow rounded-xl font-bold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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
            onClick={handleAddToCart}
            disabled={isAdding || (selectedVariant?.stockQuantity ?? 0) <= 0}
            className={cn(
              "flex-1 h-14 font-black text-[14px] uppercase tracking-[0.1em]",
              "bg-secondary-container text-on-secondary-container",
              "shadow-xl shadow-secondary-container/20 hover:shadow-2xl hover:shadow-secondary-container/30",
              "hover:bg-[#ff9f1a] transition-all duration-300 active:scale-[0.98]",
              "flex items-center justify-center gap-3 rounded-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            )}
          >
            {isAdding ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShoppingBag size={20} />
                {selectedVariant ? "Add to Bag" : "Select Size"}
              </>
            )}
          </button>
        </div>

        {/* Wishlist */}
        <button
          aria-label="Add to Wishlist"
          className="w-full h-14 border border-outline-variant bg-surface text-on-surface-variant hover:text-on-surface hover:border-on-surface flex items-center justify-center gap-3 transition-all duration-300 rounded-xl font-bold text-xs uppercase tracking-widest"
        >
          <Heart className="w-5 h-5" />
          Add to Wishlist
        </button>
      </div>

      {/* Accordions / Information */}
      <div className="border border-outline-variant rounded-xl divide-y divide-outline-variant bg-surface-bright shadow-sm overflow-hidden">
        <details className="group" open>
          <summary
            className="flex justify-between items-center text-[18px] font-bold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden uppercase tracking-tight"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Product Description
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[15px] leading-[1.6]">
            {product.description || "No description provided for this high-performance gear."}
          </div>
        </details>
        <details className="group">
          <summary
            className="flex justify-between items-center text-[18px] font-bold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden uppercase tracking-tight"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Shipping & Returns
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[15px] leading-[1.6]">
            <p className="mb-2">
              Free standard shipping on orders over $100. Expedited options available at checkout.
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
