"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/data/homeData";
import { FEATURED_PRODUCTS } from "@/data/homeData";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LargeCardProps {
  product: ProductCard;
}

interface SmallCardProps {
  product: ProductCard;
}

// ─── LargeCard ───────────────────────────────────────────────────────────────
function LargeCard({ product }: Readonly<LargeCardProps>) {
  const { locale } = useTranslation();
  return (
    <Link
      href={`/${locale}/product/${product.id}`}
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
          {product.category}
        </span>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-[4/3] bg-surface-container-low relative overflow-hidden flex items-center justify-center p-8">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
          sizes="(max-width: 768px) 100vw, 58vw"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3
          className="text-[20px] font-semibold leading-[1.4] text-on-background mb-1"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {product.name}
        </h3>
        <p className="text-[14px] leading-[1.5] text-on-surface-variant mb-6 line-clamp-2">
          Responsive cushioning for your everyday run. Lighter and more
          breathable than ever.
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span
            className="text-[20px] font-semibold text-on-background"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {product.price}
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
function SmallCard({ product }: Readonly<SmallCardProps>) {
  const { locale } = useTranslation();
  return (
    <Link
      href={`/${locale}/product/${product.id}`}
      className={cn(
        "group",
        "bg-surface-container-lowest border border-black/[0.04]",
        "rounded-xl overflow-hidden",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
        "transition-all duration-500 flex flex-row"
      )}
    >
      {/* Image */}
      <div className="w-2/5 bg-surface-container-low relative overflow-hidden flex items-center justify-center p-4 shrink-0">
        {product.badge && (
          <span className="absolute top-2 left-2 bg-secondary-container text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full z-10">
            {product.badge}
          </span>
        )}
        <div className="relative w-full h-full min-h-[100px]">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
            sizes="20vw"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 w-3/5 flex flex-col justify-center gap-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-outline">
          {product.category}
        </span>
        <h3
          className="text-[16px] font-semibold leading-tight text-on-background"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {product.name}
        </h3>
        <span className="text-[14px] font-semibold text-on-surface-variant mt-auto">
          {product.price}
        </span>
      </div>
    </Link>
  );
}

// ─── FeaturedProducts ─────────────────────────────────────────────────────────
export default function FeaturedProducts() {
  const { t, locale } = useTranslation();
  const [large] = FEATURED_PRODUCTS.filter((p) => p.size === "large");
  const small = FEATURED_PRODUCTS.filter((p) => p.size === "small");

  return (
    <section className="max-w-[1280px] mx-auto px-8 py-16">
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

      {/* Asymmetric Zig-Zag Grid — NOT a 3-equal-column layout */}
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
    </section>
  );
}
