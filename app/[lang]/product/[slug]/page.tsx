"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { productService, ProductDetailResponse } from "@/services/productService";
import { reviewService, ReviewResponse } from "@/services/reviewService";
import { Loader2, AlertCircle, Star, User, Calendar, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useTranslation();
  
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await reviewService.getProductReviews(product.id, reviewsPage, 5);
        setReviews(res.data.content);
        setReviewsTotalPages(res.data.totalPages);
        setReviewsCount(res.data.totalElements);
      } catch (err) {
        console.error("Failed to fetch product reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [product, reviewsPage]);

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

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-[1280px] mx-auto w-full animate-in fade-in duration-700">
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/40">
          <Breadcrumbs 
            items={[
              { label: locale === "vi" ? "Sản phẩm" : "Products", href: "/products" },
              { label: product.name }
            ]} 
          />
          
          <Link 
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 text-[10px] font-lexend font-black uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
          >
            <ArrowLeft size={12} />
            {locale === "vi" ? "Quay lại sản phẩm" : "Back to products"}
          </Link>
        </div>

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

        {/* Reviews Section */}
        <div className="mt-32 pt-20 border-t border-outline-variant text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <h3 
              className="text-2xl sm:text-3xl font-black italic tracking-tighter text-on-surface uppercase leading-none"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {t("product.reviews.title") || "Athlete Feedback"} ({reviewsCount})
            </h3>
          </div>

          {reviewsLoading && reviews.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-surface-variant/20 border border-outline-variant rounded-3xl p-8 text-center text-on-surface-variant font-medium italic">
              {t("product.reviews.noReviews") || "No reviews yet. Be the first to field test this gear!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Ratings Summary Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container/20 border border-outline-variant/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <span className="font-lexend font-black text-5xl text-on-surface italic leading-none">
                    {product.averageRating?.toFixed(1) || "5.0"}
                  </span>
                  
                  <div className="flex gap-0.5 text-warning my-3">
                    {[...Array(5)].map((_, i) => {
                      const avg = product.averageRating ?? 5;
                      return (
                        <Star 
                          key={i} 
                          size={18} 
                          fill={i < Math.round(avg) ? "currentColor" : "none"} 
                          className={i < Math.round(avg) ? "text-warning" : "text-outline-variant"} 
                        />
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
                    {t("product.reviews.averageRating") || "Average Rating"}
                  </span>
                </div>
              </div>

              {/* Reviews List Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-outline-variant rounded-3xl divide-y divide-outline-variant bg-surface overflow-hidden">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 space-y-4">
                      
                      {/* Reviewer Details */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                            {review.userAvatar ? (
                              <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                            ) : (
                              <User size={16} className="text-on-surface-variant/60" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-on-surface font-lexend">{review.userName}</h4>
                            <p className="text-[9px] font-bold text-on-surface-variant/50 flex items-center gap-1 mt-0.5">
                              <Calendar size={10} />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-0.5 text-warning">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < review.rating ? "currentColor" : "none"} 
                              className={i < review.rating ? "text-warning" : "text-outline-variant"} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment & Images */}
                      <div className="space-y-3 pl-12">
                        <p className="text-sm text-on-surface leading-relaxed font-semibold">{review.comment}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.images.map((imgUrl, idx) => (
                              <div 
                                key={idx}
                                onClick={() => setZoomedImage(imgUrl)}
                                className="w-16 h-16 rounded-xl overflow-hidden border border-outline-variant cursor-zoom-in hover:brightness-90 transition-all shadow-sm"
                              >
                                <img src={imgUrl} alt={`Customer image ${idx+1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Admin Reply */}
                        {review.replyComment && (
                          <div className="bg-surface-variant/20 border border-outline-variant/50 rounded-2xl p-4 mt-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                              {t("product.reviews.replyTitle") || "Sport Pro Team Response"}
                            </p>
                            <p className="text-xs font-semibold text-on-surface-variant mt-1">{review.replyComment}</p>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {reviewsTotalPages > 1 && (
                  <div className="flex items-center justify-between bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-on-surface-variant">
                      {t("product.reviews.showingPage")?.replace("{page}", String(reviewsPage + 1)).replace("{totalPages}", String(reviewsTotalPages)) || `Showing page ${reviewsPage + 1} of ${reviewsTotalPages}`}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={reviewsPage === 0}
                        onClick={() => setReviewsPage(reviewsPage - 1)}
                        className="rounded-xl border-outline-variant h-9 px-4 font-bold text-xs"
                      >
                        {t("product.reviews.previous") || "Previous"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={reviewsPage === reviewsTotalPages - 1}
                        onClick={() => setReviewsPage(reviewsPage + 1)}
                        className="rounded-xl border-outline-variant h-9 px-4 font-bold text-xs"
                      >
                        {t("product.reviews.next") || "Next"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Zoom Image Modal */}
        <Modal
          isOpen={zoomedImage !== null}
          onClose={() => setZoomedImage(null)}
          title={t("product.reviews.photoViewer") || "Photo Viewer"}
          className="max-w-2xl"
        >
          {zoomedImage && (
            <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/5 p-2">
              <img src={zoomedImage} alt="Zoomed View" className="max-h-[60vh] max-w-full object-contain" />
            </div>
          )}
        </Modal>

        {/* Recommendations Section */}
        <div className="mt-32 pt-20 border-t border-outline-variant">
          <RelatedProducts categoryId={undefined} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
