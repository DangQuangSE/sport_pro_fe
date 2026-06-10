"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Heart, ShoppingBag, Loader2, CheckCircle2, Star, Minus, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductDetailResponse } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProductInfoProps {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: Readonly<ProductInfoProps>) {
  const { t, locale } = useTranslation();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Extract unique colors (name & hex) from variants
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    product.variants.forEach(v => {
      if (v.colorName) {
        colorMap.set(v.colorName, v.colorHex || "#18181B");
      } else if (v.color) {
        colorMap.set(v.color, "#18181B");
      }
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name || "");
  
  const availableSizes = useMemo(() => {
    return product.variants
      .filter(v => (v.colorName || v.color) === selectedColor)
      .map(v => v.size);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Find the specific variant based on selections
  const selectedVariant = useMemo(() => {
    return product.variants.find(v => (v.colorName || v.color) === selectedColor && v.size === selectedSize);
  }, [product.variants, selectedColor, selectedSize]);

  // Reset selected size if it's not available in the new color
  useMemo(() => {
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [availableSizes, selectedSize]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error(t("product.details.selectSize") || "Please select a size.");
      return;
    }

    if (!selectedVariant) {
      toast.error(t("product.details.selectSize") || "Please select a size.");
      return;
    }

    // Guest Redirection Flow
    if (!isLoggedIn) {
      toast.error(t("product.details.authRequired") || "Sign In Required", {
        description: t("product.details.pleaseLoginCart") || "Please sign in to add gear to your bag.",
      });
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
      return;
    }

    try {
      setIsAdding(true);
      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity
      });
      
      toast.success(t("product.details.addedToBag") || "Added to Bag!", {
        description: `${product.name} - ${selectedColor}, Size ${selectedSize}`,
        icon: <CheckCircle2 className="text-primary" size={18} />
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add to bag. Please try again.");
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
        className="font-[800] text-[40px] sm:text-[48px] leading-[1.1] text-on-surface uppercase italic mb-4 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        {product.name}
      </h1>

      {/* Product Rating Summary */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5 text-warning">
          {[...Array(5)].map((_, i) => {
            const avg = product.averageRating ?? 0;
            return (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.round(avg) ? "currentColor" : "none"} 
                className={i < Math.round(avg) ? "text-warning" : "text-outline-variant"} 
              />
            );
          })}
        </div>
        {product.reviewCount !== undefined && product.reviewCount > 0 ? (
          <span className="text-[11px] font-bold text-on-surface-variant font-mono">
            {product.averageRating?.toFixed(1)} {t("product.details.reviewsCount")?.replace("{count}", String(product.reviewCount)) || `(${product.reviewCount} reviews)`}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-on-surface-variant opacity-60">
            {t("product.details.noReviews") || "No reviews yet"}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-4 mb-8">
        <span
          className="font-[700] text-[32px] leading-[1.3] text-on-surface"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {currentPrice?.toLocaleString()} VND
        </span>
        {hasDiscount && (
          <span className="text-xl text-on-surface-variant line-through opacity-50">
            {originalPrice?.toLocaleString()} VND
          </span>
        )}
      </div>

      <hr className="border-t border-outline-variant mb-6 opacity-50" />

      {/* Color Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <span className="font-bold text-xs text-on-surface-variant uppercase tracking-[0.08em]">
            {t("product.details.selectColor") || "Select Color"}
          </span>
          <span className="text-sm text-on-surface font-black uppercase tracking-wider font-mono">
            {selectedColor}
          </span>
        </div>
        
        {/* Swatches Grid */}
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => {
            const isActive = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 border rounded-2xl transition-all duration-300 active:scale-95 group relative cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-outline-variant bg-surface hover:border-on-surface hover:bg-surface-variant/30"
                )}
              >
                <span 
                  className="w-5 h-5 rounded-full border border-outline-variant/60 shadow-inner block transition-transform group-hover:scale-115 relative overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                </span>
                
                <span className="font-black text-[11px] uppercase tracking-widest leading-none">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-xs text-on-surface-variant uppercase tracking-[0.08em]">
            {t("product.details.selectSize") || "Select Size"}
          </span>
          <button className="font-bold text-[10px] text-primary underline underline-offset-4 hover:text-primary-fixed transition-colors tracking-[0.08em]">
            {t("product.details.sizeGuide") || "Size Guide"}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((size) => {
            const isActive = selectedSize === size;
            const variantForSize = product.variants.find(v => (v.colorName || v.color) === selectedColor && v.size === size);
            const isOutOfStock = (variantForSize?.stockQuantity ?? 0) <= 0;

            return (
              <button
                key={size}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "py-3 border font-semibold text-[14px] tracking-[0.05em] rounded-xl transition-all relative overflow-hidden cursor-pointer",
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
          <div className="flex items-center h-14 border border-outline-variant bg-surface rounded-xl overflow-hidden shrink-0 w-32">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="h-full w-10 flex items-center justify-center text-on-surface hover:bg-surface-variant/40 active:scale-90 transition-all cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/[^0-9]/g, ""));
                const maxStock = selectedVariant ? selectedVariant.stockQuantity : 999;
                if (isNaN(val) || val < 1) {
                  setQuantity(1);
                } else {
                  setQuantity(Math.min(val, maxStock));
                }
              }}
              className="w-12 h-full bg-transparent text-center font-bold text-base text-on-surface border-none outline-none focus:ring-0 focus:border-none p-0"
            />
            <button
              type="button"
              onClick={() => {
                const maxStock = selectedVariant ? selectedVariant.stockQuantity : 999;
                setQuantity(prev => Math.min(prev + 1, maxStock));
              }}
              className="h-full w-10 flex items-center justify-center text-on-surface hover:bg-surface-variant/40 active:scale-90 transition-all cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (selectedVariant && selectedVariant.stockQuantity <= 0)}
            className={cn(
              "flex-1 h-14 font-black text-[14px] uppercase tracking-[0.1em]",
              "bg-secondary-container text-on-secondary-container",
              "shadow-xl shadow-secondary-container/20 hover:shadow-2xl hover:shadow-secondary-container/30",
              "hover:bg-[#ff9f1a] transition-all duration-300 active:scale-[0.98] cursor-pointer",
              "flex items-center justify-center gap-3 rounded-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            )}
          >
            {isAdding ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShoppingBag size={20} />
                {selectedVariant ? t("product.details.addToCart") : t("product.details.selectSize")}
              </>
            )}
          </button>
        </div>

        {/* Wishlist */}
        <button
          aria-label={t("product.details.wishlist") || "Add to Wishlist"}
          className="w-full h-14 border border-outline-variant bg-surface text-on-surface-variant hover:text-on-surface hover:border-on-surface flex items-center justify-center gap-3 transition-all duration-300 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          {t("product.details.wishlist") || "Add to Wishlist"}
        </button>
      </div>

      {/* Accordions / Information */}
      <div className="border border-outline-variant rounded-xl divide-y divide-outline-variant bg-surface-bright shadow-sm overflow-hidden">
        <details className="group" open>
          <summary
            className="flex justify-between items-center text-[18px] font-bold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden uppercase tracking-tight"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("product.details.description") || "Product Description"}
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[15px] leading-[1.6]">
            {product.description || (locale === "vi" ? "Chưa có mô tả kỹ thuật cho trang bị hiệu năng này." : "No description provided for this high-performance gear.")}
          </div>
        </details>
        <details className="group">
          <summary
            className="flex justify-between items-center text-[18px] font-bold text-on-surface cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden uppercase tracking-tight"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("product.details.shippingAndReturns") || "Shipping & Returns"}
            <ChevronDown className="w-5 h-5 transition duration-300 group-open:rotate-180 text-on-surface-variant" />
          </summary>
          <div className="p-6 pt-0 text-on-surface-variant text-[15px] leading-[1.6]">
            <p className="mb-2">
              {t("product.details.shippingDesc1") || "Free standard shipping on orders over 500,000 VND. Expedited options available at checkout."}
            </p>
            <p>
              {t("product.details.shippingDesc2") || "Returns accepted within 30 days of delivery in unworn condition."}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
