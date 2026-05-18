"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImageResponse } from "@/services/productService";

interface ProductGalleryProps {
  images: ProductImageResponse[];
}

export default function ProductGallery({
  images,
}: Readonly<ProductGalleryProps>) {
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const mainThumbnail = sortedImages.find(img => img.isThumbnail) || sortedImages[0];
  
  const [activeImage, setActiveImage] = useState(mainThumbnail?.imageUrl || "/placeholder-product.png");

  // Sync active image if images change (e.g. initial load)
  useEffect(() => {
    if (mainThumbnail) {
      setActiveImage(mainThumbnail.imageUrl);
    }
  }, [mainThumbnail]);

  if (!sortedImages.length) {
    return (
      <div className="flex-1 aspect-[4/5] bg-surface-container-low rounded-2xl animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 h-fit">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full md:w-[100px] shrink-0 snap-x scrollbar-hide">
        {sortedImages.map((image) => {
          const isActive = activeImage === image.imageUrl;
          return (
            <button
              key={image.id}
              onClick={() => setActiveImage(image.imageUrl)}
              className={cn(
                "snap-start shrink-0 w-[80px] md:w-full aspect-square",
                "bg-surface-container overflow-hidden relative rounded-xl transition-all duration-300",
                isActive
                  ? "border-2 border-primary ring-2 ring-primary/20"
                  : "border-2 border-transparent hover:border-outline-variant opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image.imageUrl}
                alt={`Product thumbnail`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Canvas */}
      <div className="flex-1 aspect-[4/5] bg-white overflow-hidden relative shadow-2xl shadow-primary/5 border border-outline-variant group rounded-3xl">
        <img
          src={activeImage}
          alt="Product Main View"
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-tl-[100%] pointer-events-none" />
      </div>
    </div>
  );
}
