"use client";

import React from "react";
import Link from "next/link";
import { Star, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductListResponse } from "@/services/productService";
import { BRAND_CONFIG } from "@/constants/brand";

interface ProductCardProps {
  product: ProductListResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, locale } = useTranslation();
  
  const hasDiscount = !!(product.salePrice && product.originalPrice && product.originalPrice > product.salePrice);
  const activePrice = hasDiscount && product.salePrice ? product.salePrice : product.originalPrice;
  const crossedPrice = hasDiscount ? product.originalPrice : null;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-surface rounded-[2rem] border border-outline-variant p-4 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
    >
      <div className="space-y-5">
        {/* Product Thumbnail Layout */}
        <Link 
          href={`/${locale}/product/${product.slug}`}
          className="aspect-[4/5] w-full rounded-2xl bg-surface-container flex items-center justify-center overflow-hidden relative p-4 block cursor-pointer"
        >
          {/* Shimmer transition overlay */}
          <div className="absolute inset-0 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors duration-500" />
          
          <img 
            src={product.imageUrl || "/placeholder-product.png"} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-2"
          />

          {/* Badges container */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            {hasDiscount && (
              <span className="bg-secondary text-on-secondary text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-0.5">
                <Percent size={8} />
                {t("catalog.promo")}
              </span>
            )}
          </div>
        </Link>

        {/* Details Content */}
        <div className="space-y-1.5 px-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            <span>{product.brandName || BRAND_CONFIG.name}</span>
            <span className="text-primary">{product.categoryName || "Training"}</span>
          </div>

          <Link 
            href={`/${locale}/product/${product.slug}`}
            className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors block line-clamp-1"
          >
            {product.name}
          </Link>
          
          {/* Star Rating summary mockup */}
          <div className="flex items-center gap-1 pt-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={10} 
                className={cn(
                  idx < Math.round(product.averageRating || 4.8) 
                    ? "fill-secondary text-secondary" 
                    : "text-outline-variant/60"
                )} 
              />
            ))}
            <span className="text-[9px] font-bold text-on-surface-variant ml-1">({product.averageRating || 4.8})</span>
          </div>
        </div>
      </div>

      {/* Purchase & Pricing bar */}
      <div className="flex justify-between items-center pt-5 border-t border-outline-variant/40 mt-6 px-2">
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">{t("catalog.basePrice")}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-base font-black italic tracking-tighter text-on-surface">
              {activePrice ? `${activePrice.toLocaleString()} đ` : (locale === "vi" ? "Liên hệ" : "Contact us")}
            </p>
            {hasDiscount && crossedPrice && (
              <p className="text-xs font-semibold line-through text-on-surface-variant/50">
                {crossedPrice.toLocaleString()} đ
              </p>
            )}
          </div>
        </div>

        <Link href={`/${locale}/product/${product.slug}`}>
          <Button 
            size="sm" 
            className="rounded-xl h-10 px-5 bg-on-surface text-surface group-hover:bg-primary group-hover:text-on-primary hover:scale-105 transition-all font-lexend font-black uppercase tracking-widest text-[9px]"
          >
            {t("catalog.deploy")}
          </Button>
        </Link>
      </div>

    </motion.div>
  );
}
