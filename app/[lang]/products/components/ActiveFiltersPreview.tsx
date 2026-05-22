"use client";

import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getGenderLabel } from "./utils";

interface ActiveFiltersPreviewProps {
  debouncedSearch: string;
  selectedCategory: string;
  selectedBrand: string;
  selectedSize: string;
  selectedColor: string;
  selectedGender: string;
  minPrice: number | "";
  maxPrice: number | "";
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setSelectedGender: (gender: string) => void;
  setMinPrice: (price: number | "") => void;
  setMaxPrice: (price: number | "") => void;
}

export default function ActiveFiltersPreview({
  debouncedSearch,
  selectedCategory,
  selectedBrand,
  selectedSize,
  selectedColor,
  selectedGender,
  minPrice,
  maxPrice,
  setSearchQuery,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedSize,
  setSelectedColor,
  setSelectedGender,
  setMinPrice,
  setMaxPrice,
}: ActiveFiltersPreviewProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2 bg-primary/[0.02] p-3 rounded-xl border border-primary/10">
      <span className="text-[9px] font-black uppercase tracking-widest text-primary mr-2">
        {t("catalog.activeFilters")}
      </span>

      {debouncedSearch && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          "{debouncedSearch}"
          <button onClick={() => setSearchQuery("")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {selectedCategory && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {selectedCategory}
          <button onClick={() => setSelectedCategory("")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {selectedBrand && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {selectedBrand}
          <button onClick={() => setSelectedBrand("")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {selectedSize && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {t("catalog.sizes")}: {selectedSize}
          <button onClick={() => setSelectedSize("")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {selectedColor && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {t("catalog.colors")}: {selectedColor}
          <button onClick={() => setSelectedColor("")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {selectedGender !== "ALL" && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {t("catalog.gender")}: {getGenderLabel(selectedGender, t)}
          <button onClick={() => setSelectedGender("ALL")} className="hover:text-error">
            <X size={10} />
          </button>
        </span>
      )}
      {(minPrice || maxPrice) && (
        <span className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-outline-variant/60 text-[10px] font-bold uppercase text-on-surface-variant">
          {minPrice ? `${minPrice.toLocaleString()}đ` : "0"} —{" "}
          {maxPrice ? `${maxPrice.toLocaleString()}đ` : locale === "vi" ? "Tối đa" : "Max"}
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
            className="hover:text-error"
          >
            <X size={10} />
          </button>
        </span>
      )}
    </div>
  );
}
