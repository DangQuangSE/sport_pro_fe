"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductGalleryProps {
  mainImage: string;
  thumbnails: string[];
  badge?: string;
}

export default function ProductGallery({
  mainImage,
  thumbnails,
  badge,
}: Readonly<ProductGalleryProps>) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4 h-fit">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible w-full md:w-[100px] shrink-0 snap-x">
        {thumbnails.map((thumb, idx) => {
          const isActive = activeImage === thumb;
          return (
            <button
              key={idx}
              onClick={() => setActiveImage(thumb)}
              className={cn(
                "snap-start shrink-0 w-[80px] md:w-full aspect-square",
                "bg-surface-container overflow-hidden relative rounded-xl transition-colors",
                isActive
                  ? "border-2 border-primary"
                  : "border-2 border-transparent hover:border-outline-variant"
              )}
            >
              <Image
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 100px"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Canvas */}
      <div className="flex-1 aspect-[4/5] bg-surface-container-low overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant group rounded-2xl">
        {badge && (
          <div className="absolute top-4 left-4 z-10 bg-surface text-on-surface font-semibold text-[12px] px-3 py-1 shadow-sm border border-outline-variant uppercase rounded-full tracking-[0.05em]">
            {badge === "New Release" ? t("product.details.newRelease") : badge}
          </div>
        )}
        <Image
          src={activeImage}
          alt="Product Main Image"
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
    </div>
  );
}
