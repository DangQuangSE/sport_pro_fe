"use client";

import React from "react";
import { SlidersHorizontal, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { getColorHex, getGenderLabel } from "./utils";
import { ProductListResponse } from "@/services/productService";

interface FilterSidebarProps {
  categories: any[];
  brands: any[];
  selectedCategory: string;
  selectedBrand: string;
  selectedGender: string;
  selectedSize: string;
  selectedColor: string;
  minPrice: number | "";
  maxPrice: number | "";
  masterSizes: string[];
  masterColors: string[];
  products: ProductListResponse[];
  expandedCategories: Record<number, boolean>;
  handleCategorySelect: (categorySlug: string) => void;
  toggleCategoryNode: (id: number, e: React.MouseEvent) => void;
  setSelectedGender: (gender: string) => void;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setMinPrice: React.Dispatch<React.SetStateAction<number | "">>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | "">>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleClearAll: () => void;
  hasActiveFilters: boolean;
}

export default function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedGender,
  selectedSize,
  selectedColor,
  minPrice,
  maxPrice,
  masterSizes,
  masterColors,
  products,
  expandedCategories,
  handleCategorySelect,
  toggleCategoryNode,
  setSelectedGender,
  setSelectedBrand,
  setSelectedSize,
  setSelectedColor,
  setMinPrice,
  setMaxPrice,
  setPage,
  handleClearAll,
  hasActiveFilters,
}: FilterSidebarProps) {
  const { t, locale } = useTranslation();

  // Active available sizes and colors in current result set
  const activeSizes = new Set<string>();
  const activeColors = new Set<string>();
  products.forEach((p) => {
    p.availableSizes?.forEach((s) => activeSizes.add(s));
    p.availableColors?.forEach((c) => activeColors.add(c));
  });

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto pr-6 custom-scrollbar">
      {/* Active filter summary bar */}
      <div className="flex justify-between items-center">
        <h3 className="font-lexend font-black text-xs uppercase tracking-widest text-on-surface flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-primary" />
          {t("catalog.filtersTitle")}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
          >
            <RefreshCw size={10} />
            {t("catalog.reset")}
          </button>
        )}
      </div>

      <div className="border-t border-outline-variant/60 pt-6 space-y-8">
        {/* 1. Categorization list tree */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {t("catalog.categories")}
          </p>
          <div className="space-y-1">
            {categories.map((cat) => {
              const hasChildren = cat.children && cat.children.length > 0;
              const isExpanded = !!expandedCategories[cat.id];
              const isSelected = selectedCategory === cat.slug;

              return (
                <div key={cat.id} className="space-y-1">
                  <div
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary text-on-primary shadow-md shadow-primary/10"
                        : "text-on-surface hover:bg-surface-container/60"
                    )}
                  >
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategoryNode(cat.id, e)}
                        className={cn(
                          "p-1 rounded hover:bg-black/5 transition-colors",
                          isSelected ? "text-on-primary" : "text-on-surface-variant"
                        )}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                  </div>

                  {/* Render subcategories */}
                  {hasChildren && isExpanded && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-5 space-y-1 border-l border-outline-variant/60 ml-3"
                      >
                        {cat.children.map((child: any) => {
                          const isChildSelected = selectedCategory === child.slug;
                          return (
                            <div
                              key={child.id}
                              onClick={() => handleCategorySelect(child.slug)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer uppercase tracking-wider",
                                isChildSelected
                                  ? "text-primary font-bold"
                                  : "text-on-surface-variant hover:text-on-surface"
                              )}
                            >
                              {child.name}
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Gender segmented selector */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {t("catalog.gender")}
          </p>
          <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/60">
            {["ALL", "MEN", "WOMEN", "UNISEX"].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGender(g);
                  setPage(0);
                }}
                className={cn(
                  "py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all text-center",
                  selectedGender === g
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {getGenderLabel(g, t)}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Brands dynamic checklist */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {t("catalog.brands")}
          </p>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => {
              const isSelected = selectedBrand === b.name;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand((prev) => (prev === b.name ? "" : b.name));
                    setPage(0);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                    isSelected
                      ? "bg-on-surface text-surface border-on-surface shadow-sm"
                      : "border-outline-variant/60 hover:border-primary text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size filter */}
        {masterSizes.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              {t("catalog.sizes")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {masterSizes.map((size) => {
                const isSelected = selectedSize === size;
                const isDimmed = products.length > 0 && !activeSizes.has(size) && !isSelected;

                return (
                  <button
                    key={size}
                    disabled={isDimmed}
                    onClick={() => {
                      setSelectedSize((prev) => (prev === size ? "" : size));
                      setPage(0);
                    }}
                    className={cn(
                      "h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center relative overflow-hidden",
                      isSelected
                        ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/10"
                        : isDimmed
                        ? "border-outline-variant/20 text-on-surface-variant/30 bg-surface-container/20 cursor-not-allowed pointer-events-none line-through"
                        : "border-outline-variant/60 hover:border-primary text-on-surface-variant hover:text-on-surface bg-surface-container/40"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color filter */}
        {masterColors.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              {t("catalog.colors")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {masterColors.map((colorName) => {
                const isSelected = selectedColor === colorName;
                const isDimmed = products.length > 0 && !activeColors.has(colorName) && !isSelected;
                const hexColor = getColorHex(colorName);
                const isWhite = colorName.toLowerCase() === "white";

                return (
                  <button
                    key={colorName}
                    disabled={isDimmed}
                    onClick={() => {
                      setSelectedColor((prev) => (prev === colorName ? "" : colorName));
                      setPage(0);
                    }}
                    title={colorName}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all relative flex items-center justify-center shadow-sm border",
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 scale-110 border-primary"
                        : isDimmed
                        ? "opacity-20 cursor-not-allowed pointer-events-none scale-90 border-outline-variant/10"
                        : "hover:scale-110 cursor-pointer border-outline-variant/40"
                    )}
                    style={{ backgroundColor: hexColor }}
                  >
                    {isSelected && (
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isWhite ? "bg-black" : "bg-white"
                        )}
                      />
                    )}
                    {isDimmed && (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                        <div className="w-[140%] h-[1.5px] bg-on-surface-variant/40 rotate-45 transform" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Price custom filters */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {t("catalog.price")}
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder={locale === "vi" ? "TỐI THIỂU" : "MIN"}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
                setPage(0);
              }}
              className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs font-bold border border-outline-variant/60 focus:border-primary outline-none"
            />
            <span className="text-outline-variant">—</span>
            <input
              type="number"
              placeholder={locale === "vi" ? "TỐI ĐA" : "MAX"}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
                setPage(0);
              }}
              className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs font-bold border border-outline-variant/60 focus:border-primary outline-none"
            />
          </div>

          {/* Quick price limits */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMinPrice("");
                setMaxPrice(1000000);
                setPage(0);
              }}
              className="py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-[9px] font-bold uppercase tracking-wider text-on-surface text-center transition-all border border-outline-variant/40"
            >
              {t("catalog.under1m")}
            </button>
            <button
              onClick={() => {
                setMinPrice(1000000);
                setMaxPrice(3000000);
                setPage(0);
              }}
              className="py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-[9px] font-bold uppercase tracking-wider text-on-surface text-center transition-all border border-outline-variant/40"
            >
              {t("catalog.1m3m")}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
