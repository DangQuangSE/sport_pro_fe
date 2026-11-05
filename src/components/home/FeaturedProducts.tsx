"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import type { ProductListResponse } from "@/services/productService";
import { BRAND_CONFIG } from "@/constants/brand";
import { ProductTileSkeleton } from "@/components/loading/ContentSkeleton";

function FeaturedProductCard({ product }: { product: ProductListResponse }) {
  const { locale, t } = useTranslation();
  const originalPrice = product.originalPrice ?? product.basePrice;
  const hasDiscount = typeof product.salePrice === "number" && product.salePrice >= 0
    && typeof originalPrice === "number" && product.salePrice < originalPrice;
  const price = hasDiscount ? product.salePrice! : originalPrice;
  const formatPrice = (amount: number) => new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-outline-variant/60 bg-white transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <img
          src={product.imageUrl || "/placeholder-product.png"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition-transform duration-300 motion-safe:group-hover:scale-[1.03] sm:p-8"
        />
        {product.totalStock === 0 && (
          <span className="absolute left-4 top-4 rounded-full border border-outline-variant/60 bg-white px-3 py-1.5 text-xs font-medium text-on-surface-variant">
            {t("product.details.outOfStock")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-2 truncate text-xs font-semibold uppercase tracking-wider text-primary">
          {product.categoryName || product.brandName || BRAND_CONFIG.name}
        </p>
        <h3 className="min-h-14 line-clamp-2 font-lexend text-xl font-semibold leading-7 tracking-tight text-on-surface">
          {product.name}
        </h3>
        <div className="mb-5 mt-3 flex min-h-8 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-lexend text-xl font-bold tabular-nums text-on-surface">
            {typeof price === "number" && Number.isFinite(price) ? formatPrice(price) : t("home.featured.contactPrice")}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm tabular-nums text-on-surface-variant line-through">
                <span className="sr-only">{t("home.featured.originalPrice")} </span>
                {formatPrice(originalPrice)}
              </span>
              <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-bold text-on-secondary-container">
                {t("catalog.promo")}
              </span>
            </>
          )}
        </div>
        <div className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-outline-variant/60 pt-4 text-sm font-semibold text-primary">
          <span>{t("home.featured.viewDetails")}</span>
          <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts() {
  const { t, locale } = useTranslation();
  const { products, isLoading, error } = useFeaturedProducts();
  if (error || (!isLoading && products.length === 0)) return null;
  const gridClass = cn(
    "grid grid-cols-1 gap-6 lg:gap-8",
    isLoading || products.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : products.length === 2 ? "sm:grid-cols-2" : "mx-auto max-w-md",
  );

  return (
    <section aria-labelledby="featured-products-title" className="mx-auto max-w-[1120px] px-4 pb-16 pt-6 sm:px-8 sm:pb-20">
      <div className="mb-7 flex flex-col gap-5 border-t border-outline-variant/60 pt-7 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 id="featured-products-title" className="font-lexend text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            {t("home.featured.title")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant sm:text-base">
            {t("home.featured.subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/products`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 self-start rounded-full border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {t("home.featured.viewAll")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <div className={gridClass} aria-busy={isLoading}>
        {isLoading && <span role="status" className="sr-only">{t("pageLoading.label")}</span>}
        {isLoading ? Array.from({ length: 3 }, (_, i) => <ProductTileSkeleton key={i} />)
          : products.map(product => <FeaturedProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
