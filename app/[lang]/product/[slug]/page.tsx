"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { productService, ProductDetailResponse } from "@/services/productService";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useTranslation();
  
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getProductBySlug(slug);
        setProduct(response.data);
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err.response?.data?.message || "Failed to load product gear.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="font-lexend font-black uppercase tracking-widest text-xs text-on-surface-variant">Calibrating Performance Data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-8">
          <div className="flex flex-col items-center text-center gap-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-error/10 text-error flex items-center justify-center">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Gear Not Found</h2>
              <p className="text-on-surface-variant font-medium">{error || "The requested product is currently unavailable in our locker room."}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="h-12 px-8 rounded-xl bg-on-surface text-surface font-black uppercase tracking-widest text-xs hover:bg-on-surface/90 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-8 max-w-[1280px] mx-auto w-full animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Product Media */}
          <div className="md:col-span-7">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Product Details & Purchase */}
          <div className="md:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-32 pt-20 border-t border-outline-variant">
          <RelatedProducts categoryId={undefined} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
