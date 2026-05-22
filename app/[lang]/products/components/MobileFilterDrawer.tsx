"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { getColorHex, getGenderLabel } from "./utils";
import { Button } from "@/components/ui/button";
import { ProductListResponse } from "@/services/productService";

interface MobileFilterDrawerProps {
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
  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
  handleCategorySelect: (categorySlug: string) => void;
  setSelectedGender: (gender: string) => void;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setMinPrice: React.Dispatch<React.SetStateAction<number | "">>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | "">>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleClearAll: () => void;
}

export default function MobileFilterDrawer({
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
  mobileFilterOpen,
  setMobileFilterOpen,
  handleCategorySelect,
  setSelectedGender,
  setSelectedBrand,
  setSelectedSize,
  setSelectedColor,
  setMinPrice,
  setMaxPrice,
  setPage,
  handleClearAll,
}: MobileFilterDrawerProps) {
  const { t, locale } = useTranslation();

  // Active available sizes and colors in current result set
  const activeSizes = new Set<string>();
  const activeColors = new Set<string>();
  products.forEach((p) => {
    p.availableSizes?.forEach((s) => activeSizes.add(s));
    p.availableColors?.forEach((c) => activeColors.add(c));
  });

  return (
    <AnimatePresence>
      {mobileFilterOpen && (
        <>
          {/* Backdrop blur click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[380px] bg-white z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-lexend font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-primary" />
                  {t("catalog.mobileFiltersTitle")}
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border-t border-outline-variant/60 pt-6 space-y-6">
                {/* Category Tree filter */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {t("catalog.categories")}
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          handleCategorySelect(cat.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                          selectedCategory === cat.slug
                            ? "bg-primary text-on-primary"
                            : "hover:bg-surface-container"
                        )}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender filter */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {t("catalog.gender")}
                  </p>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container rounded-xl">
                    {["ALL", "MEN", "WOMEN", "UNISEX"].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setSelectedGender(g);
                          setPage(0);
                        }}
                        className={cn(
                          "py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all text-center",
                          selectedGender === g ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                        )}
                      >
                        {getGenderLabel(g, t)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands checklist */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {t("catalog.brands")}
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBrand((prev) => (prev === b.name ? "" : b.name));
                          setPage(0);
                        }}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border",
                          selectedBrand === b.name
                            ? "bg-on-surface text-surface border-on-surface"
                            : "border-outline-variant/60 text-on-surface-variant"
                        )}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size filter (mobile) */}
                {masterSizes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {t("catalog.sizes")}
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto pr-1">
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
                              "h-9 rounded-lg text-[10px] font-bold uppercase transition-all border flex items-center justify-center relative overflow-hidden",
                              isSelected
                                ? "bg-primary text-on-primary border-primary shadow-sm"
                                : isDimmed
                                ? "border-outline-variant/20 text-on-surface-variant/30 bg-surface-container/20 cursor-not-allowed pointer-events-none line-through"
                                : "border-outline-variant/60 text-on-surface-variant hover:text-on-surface bg-surface-container/40"
                            )}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color filter (mobile) */}
                {masterColors.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {t("catalog.colors")}
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
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
                              "w-7 h-7 rounded-full transition-all relative flex items-center justify-center shadow-sm border",
                              isSelected
                                ? "ring-2 ring-primary ring-offset-1 scale-105 border-primary"
                                : isDimmed
                                ? "opacity-20 cursor-not-allowed pointer-events-none scale-90 border-outline-variant/10"
                                : "border-outline-variant/40"
                            )}
                            style={{ backgroundColor: hexColor }}
                          >
                            {isSelected && (
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
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

                {/* Pricing min/max */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {t("catalog.price")}
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder={locale === "vi" ? "TỐI THIỂU" : "MIN"}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs font-bold border border-outline-variant/60 outline-none"
                    />
                    <span className="text-outline-variant">—</span>
                    <input
                      type="number"
                      placeholder={locale === "vi" ? "TỐI ĐA" : "MAX"}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs font-bold border border-outline-variant/60 outline-none"
                    />
                  </div>
                </div>

                </div>
              </div>

            <div className="pt-6 border-t border-outline-variant/60 flex gap-2">
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex-grow h-12 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                {t("catalog.reset")}
              </Button>
              <Button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-grow h-12 rounded-xl bg-primary text-on-primary text-xs font-black uppercase tracking-widest"
              >
                {t("catalog.apply")}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
