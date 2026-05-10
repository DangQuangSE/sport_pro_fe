"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { RELATED_PRODUCTS } from "@/data/productData";

export default function RelatedProducts() {
  const { t } = useTranslation();

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/30">
      <h2
        className="text-[24px] uppercase italic font-bold mb-6 text-on-surface tracking-tight"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        {t("product.related.title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {RELATED_PRODUCTS.map((product, idx) => (
          <div
            key={product.id}
            className={cn("group cursor-pointer", idx >= 2 && "hidden md:block")}
          >
            <div className="aspect-[4/5] bg-surface-container overflow-hidden mb-4 relative shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/50 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group-hover:border-outline-variant transition-all duration-300 rounded-2xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <p className="font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.08em] mb-1">
              {product.category}
            </p>
            <h3
              className="font-semibold text-[20px] text-on-surface truncate"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {product.name}
            </h3>
            <p className="text-[16px] text-on-surface font-medium mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
