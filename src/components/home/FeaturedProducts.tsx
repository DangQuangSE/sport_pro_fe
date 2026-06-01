"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { ProductListResponse } from "@/services/productService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardProps {
  product: ProductListResponse;
}

// ─── LargeCard ───────────────────────────────────────────────────────────────
function LargeCard({ product }: Readonly<CardProps>) {
  const { locale } = useTranslation();
  
  const hasDiscount = !!(product.salePrice && product.originalPrice && product.originalPrice > product.salePrice);
  const activePrice = hasDiscount && product.salePrice ? product.salePrice : product.originalPrice ?? product.basePrice;

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className={cn(
        "group md:col-span-7",
        "bg-surface-container-lowest border border-black/[0.04]",
        "rounded-xl overflow-hidden",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
        "transition-all duration-500 flex flex-col relative"
      )}
    >
      {/* Category label overlay */}
      <div className="absolute top-4 left-4 z-10 bg-surface-container-lowest/90 px-3 py-1 rounded border border-surface-variant backdrop-blur-sm">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface">
          {product.categoryName || "Running"}
        </span>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-[4/3] bg-surface-container-low relative overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.imageUrl || "/placeholder-product.png"}
          alt={product.name}
          className="object-contain w-full h-full max-h-[350px] group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
          {product.brandName || "Sport Pro"}
        </div>
        <h3
          className="text-[20px] font-semibold leading-[1.4] text-on-background mb-2 line-clamp-1"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {product.name}
        </h3>
        <p className="text-[14px] leading-[1.5] text-on-surface-variant mb-6 line-clamp-2">
          {product.brandName || "Sport Pro"} professional elite footwear designed for peak performance, extreme comfort, and durability under athletic workloads.
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span
            className="text-[20px] font-semibold text-on-background"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {activePrice ? `${activePrice.toLocaleString()} đ` : (locale === "vi" ? "Liên hệ" : "Contact us")}
          </span>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "border-2 border-primary text-primary",
              "hover:bg-primary hover:text-white",
              "transition-colors duration-200"
            )}
          >
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── SmallCard ────────────────────────────────────────────────────────────────
function SmallCard({ product }: Readonly<CardProps>) {
  const { locale, t } = useTranslation();
  
  const hasDiscount = !!(product.salePrice && product.originalPrice && product.originalPrice > product.salePrice);
  const activePrice = hasDiscount && product.salePrice ? product.salePrice : product.originalPrice ?? product.basePrice;

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className={cn(
        "group",
        "bg-surface-container-lowest border border-black/[0.04]",
        "rounded-xl overflow-hidden",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
        "transition-all duration-500 flex flex-row"
      )}
    >
      {/* Image */}
      <div className="w-[180px] bg-surface-container-low relative overflow-hidden flex items-center justify-center p-4 shrink-0">
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-secondary-container text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full z-10">
            {t("catalog.promo")}
          </span>
        )}
        <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
          <img
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="object-contain max-h-[150px] w-full h-full group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-outline">
            {product.categoryName || "Accessories"}
          </span>
          <h3
            className="text-[18px] font-semibold leading-snug text-on-background line-clamp-2"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {product.name}
          </h3>
        </div>
        <span className="text-[16px] font-bold text-on-surface-variant mt-auto">
          {activePrice ? `${activePrice.toLocaleString()} đ` : (locale === "vi" ? "Liên hệ" : "Contact us")}
        </span>
      </div>
    </Link>
  );
}

// ─── FeaturedProducts ─────────────────────────────────────────────────────────
export default function FeaturedProducts() {
  const { t, locale } = useTranslation();
  const { products, isLoading, error } = useFeaturedProducts();

  if (error || (!isLoading && products.length === 0)) {
    // Gracefully do not render this section if there is an error or no featured products
    return null;
  }

  const large = products[0];
  const small = products.slice(1, 3);

  return (
    <section className="max-w-[1280px] mx-auto px-8 pt-4 pb-16">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2
            className={cn(
              "text-[28px] font-bold leading-[1.3] tracking-tight uppercase text-on-background",
              "border-b-[3px] border-primary pb-1 inline-block"
            )}
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("home.featured.title")}
          </h2>
          <p className="text-[16px] text-on-surface-variant mt-2">
            {t("home.featured.subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/products`}
          className={cn(
            "hidden md:flex items-center gap-1",
            "text-[12px] font-semibold uppercase tracking-[0.05em]",
            "text-primary hover:underline underline-offset-4"
          )}
        >
          {t("home.featured.viewAll")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        /* Premium Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Card Skeleton — 7/12 */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-black/[0.04] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse flex flex-col h-[500px]">
            <div className="w-full aspect-[4/3] bg-surface-container-low" />
            <div className="p-6 flex flex-col flex-grow gap-4">
              <div className="h-4 bg-surface-container-low rounded w-1/4" />
              <div className="h-6 bg-surface-container-low rounded w-3/4" />
              <div className="h-4 bg-surface-container-low rounded w-full" />
              <div className="h-4 bg-surface-container-low rounded w-5/6 mt-auto" />
            </div>
          </div>

          {/* Small Cards Skeletons — 5/12 */}
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            <div className="bg-surface-container-lowest border border-black/[0.04] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse flex flex-row p-4 h-[238px]">
              <div className="w-2/5 bg-surface-container-low rounded-lg" />
              <div className="p-4 w-3/5 flex flex-col justify-center gap-4">
                <div className="h-3 bg-surface-container-low rounded w-1/3" />
                <div className="h-5 bg-surface-container-low rounded w-5/6" />
                <div className="h-4 bg-surface-container-low rounded w-1/2 mt-auto" />
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-black/[0.04] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse flex flex-row p-4 h-[238px]">
              <div className="w-2/5 bg-surface-container-low rounded-lg" />
              <div className="p-4 w-3/5 flex flex-col justify-center gap-4">
                <div className="h-3 bg-surface-container-low rounded w-1/3" />
                <div className="h-5 bg-surface-container-low rounded w-5/6" />
                <div className="h-4 bg-surface-container-low rounded w-1/2 mt-auto" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Asymmetric Zig-Zag Grid */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large card — 7/12 */}
          {large && <LargeCard product={large} />}

          {/* Stacked small cards — 5/12 */}
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            {small.map((product) => (
              <SmallCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
