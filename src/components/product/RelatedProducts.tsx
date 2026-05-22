"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { productService, ProductListResponse } from "@/services/productService";
import { Loader2 } from "lucide-react";

interface RelatedProductsProps {
  categoryId?: number;
}

export default function RelatedProducts({ categoryId }: Readonly<RelatedProductsProps>) {
  const { t, locale } = useTranslation();
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setIsLoading(true);
        // In a real scenario, we might have a dedicated "related" endpoint
        // or just filter by category.
        const params = categoryId ? { categoryId, pageSize: 4 } : { pageSize: 4 };
        const response = await productService.getProducts(params);
        setProducts(response.data.content);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="space-y-12">
      <h2
        className="text-[32px] uppercase italic font-black text-on-surface tracking-tighter text-center"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        Complete Your Look
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => {
          const hasDiscount = !!(product.salePrice && product.originalPrice && product.originalPrice > product.salePrice);
          const activePrice = hasDiscount && product.salePrice ? product.salePrice : product.originalPrice;
          const crossedPrice = hasDiscount ? product.originalPrice : null;

          return (
            <Link
              key={product.id}
              href={`/${locale}/product/${product.slug}`}
              className="group cursor-pointer space-y-4"
            >
              <div className="aspect-[4/5] bg-surface-container overflow-hidden relative shadow-sm border border-outline-variant/50 transition-all duration-500 rounded-2xl group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:border-primary/20">
                <img
                  src={product.imageUrl || "/placeholder-product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-on-surface text-surface text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Quick View
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {product.categoryName}
                </p>
                <h3
                  className="font-bold text-lg text-on-surface uppercase tracking-tight truncate group-hover:text-primary transition-colors"
                >
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-base text-on-surface font-black italic tracking-tighter">
                    {activePrice ? `${activePrice.toLocaleString()} đ` : (locale === "vi" ? "Liên hệ" : "Contact us")}
                  </p>
                  {hasDiscount && crossedPrice && (
                    <p className="text-xs font-semibold line-through text-on-surface-variant/50">
                      {crossedPrice.toLocaleString()} đ
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
