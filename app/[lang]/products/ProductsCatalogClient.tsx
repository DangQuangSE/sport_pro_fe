"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { productService, ProductListResponse } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import CatalogToolbar from "./components/CatalogToolbar";
import ActiveFiltersPreview from "./components/ActiveFiltersPreview";

export default function ProductsCatalogPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Route query params mapping
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");

  // State Hooks
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedBrand, setSelectedBrand] = useState(brandParam || "");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Accordion toggle lists
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Size & Color States
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [masterSizes, setMasterSizes] = useState<string[]>([]);
  const [masterColors, setMasterColors] = useState<string[]>([]);

  // Sync initial query params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (brandParam) setSelectedBrand(brandParam);
  }, [categoryParam, brandParam]);

  // Load category tree and brands once
  useEffect(() => {
    productService.getCategoryTree()
      .then(res => {
        if (res && res.data) setCategories(res.data);
      })
      .catch(err => console.error("Error loading categories:", err));

    productService.getBrands({ size: 100 })
      .then(res => {
        if (res && res.data && res.data.content) setBrands(res.data.content);
      })
      .catch(err => console.error("Error loading brands:", err));
  }, []);

  // Dynamic extraction of master sizes & colors from unfiltered catalog background fetch
  useEffect(() => {
    productService.getProducts({ size: 200 })
      .then(res => {
        if (res && res.data && res.data.content) {
          const sizesSet = new Set<string>();
          const colorsSet = new Set<string>();
          res.data.content.forEach((product: any) => {
            product.availableSizes?.forEach((s: string) => {
              if (s) sizesSet.add(s);
            });
            product.availableColors?.forEach((c: string) => {
              if (c) colorsSet.add(c);
            });
          });
          
          // Sort apparel sizes S/M/L first, then numeric shoe sizes, then alphabet
          const sortedSizes = Array.from(sizesSet).sort((a, b) => {
            const isNumA = !isNaN(Number(a));
            const isNumB = !isNaN(Number(b));
            if (isNumA && isNumB) return Number(a) - Number(b);
            if (isNumA) return 1;
            if (isNumB) return -1;
            
            const sizesOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
            const idxA = sizesOrder.indexOf(a.toUpperCase());
            const idxB = sizesOrder.indexOf(b.toUpperCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            return a.localeCompare(b);
          });

          const sortedColors = Array.from(colorsSet).sort((a, b) => a.localeCompare(b));
          setMasterSizes(sortedSizes);
          setMasterColors(sortedColors);
        }
      })
      .catch(err => console.error("Error loading master sizes/colors:", err));
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Helper to find category ID by slug recursively
  const findCategoryIdBySlug = (nodes: any[], slug: string): number | undefined => {
    for (const node of nodes) {
      if (node.slug === slug) return node.id;
      if (node.children && node.children.length > 0) {
        const childId = findCategoryIdBySlug(node.children, slug);
        if (childId !== undefined) return childId;
      }
    }
    return undefined;
  };

  // Helper to find brand ID by name
  const findBrandIdByName = (brandList: any[], name: string): number | undefined => {
    const brand = brandList.find(b => b.name === name);
    return brand ? brand.id : undefined;
  };

  // Fetch products function
  const fetchProductsList = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Gender mapping (MEN -> MALE, WOMEN -> FEMALE, UNISEX -> UNISEX)
      let mappedGender: string | undefined = undefined;
      if (selectedGender === "MEN") {
        mappedGender = "MALE";
      } else if (selectedGender === "WOMEN") {
        mappedGender = "FEMALE";
      } else if (selectedGender === "UNISEX") {
        mappedGender = "UNISEX";
      }

      // 2. Category slug to ID mapping
      const mappedCategoryId = selectedCategory ? findCategoryIdBySlug(categories, selectedCategory) : undefined;

      // 3. Brand name to ID mapping
      const mappedBrandId = selectedBrand ? findBrandIdByName(brands, selectedBrand) : undefined;

      // 4. Sort mapping (avoid JPA PropertyReferenceException for unmapped columns like price)
      let mappedSort: string | undefined = "id,desc";
      if (sortBy === "newest") {
        mappedSort = "id,desc";
      } else {
        // Price sorting is not supported at DB level on Product entity directly; fallback to id desc
        mappedSort = "id,desc";
      }

      const apiParams: Record<string, any> = {
        page: page,
        size: 9, // premium catalog grid spacing
        keyword: debouncedSearch || undefined,
        categoryId: mappedCategoryId,
        brandId: mappedBrandId,
        gender: mappedGender,
        productSize: selectedSize || undefined,
        color: selectedColor || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: mappedSort
      };

      const res = await productService.getProducts(apiParams);
      if (res && res.data) {
        setProducts(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedBrand, selectedGender, selectedSize, selectedColor, minPrice, maxPrice, sortBy, page, categories, brands]);

  // Trigger fetch when parameters modify
  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Category selection handler
  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(prev => prev === categorySlug ? "" : categorySlug);
    setPage(0);
  };

  // Toggle category tree nodes
  const toggleCategoryNode = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reset all filters helper
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedGender("ALL");
    setSelectedSize("");
    setSelectedColor("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(0);
    router.replace(`/${locale}/products`);
  };

  // Check if any filter is active
  const hasActiveFilters = 
    !!(debouncedSearch || selectedCategory || selectedBrand || 
    selectedGender !== "ALL" || selectedSize || selectedColor || minPrice || maxPrice);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      {/* ─── MAIN CATALOG WORKSPACE ─────────────────────────────────────────── */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-8 pt-24 sm:pt-32 pb-12">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: t("catalog.title") }]} />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-10">
        
        {/* ─── SIDEBAR FILTERS (DESKTOP) ────────────────────────────────────── */}
        <FilterSidebar
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          selectedGender={selectedGender}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          minPrice={minPrice}
          maxPrice={maxPrice}
          masterSizes={masterSizes}
          masterColors={masterColors}
          products={products}
          expandedCategories={expandedCategories}
          handleCategorySelect={handleCategorySelect}
          toggleCategoryNode={toggleCategoryNode}
          setSelectedGender={setSelectedGender}
          setSelectedBrand={setSelectedBrand}
          setSelectedSize={setSelectedSize}
          setSelectedColor={setSelectedColor}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setPage={setPage}
          handleClearAll={handleClearAll}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ─── GRID DISPLAY AREA ────────────────────────────────────────────── */}
        <section className="flex-grow space-y-8">
          
          {/* Interactive Toolbar */}
          <CatalogToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setPage={setPage}
            setMobileFilterOpen={setMobileFilterOpen}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Active filters chips preview */}
          {hasActiveFilters && (
            <ActiveFiltersPreview
              debouncedSearch={debouncedSearch}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              selectedGender={selectedGender}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setSearchQuery={setSearchQuery}
              setSelectedCategory={setSelectedCategory}
              setSelectedBrand={setSelectedBrand}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
              setSelectedGender={setSelectedGender}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          )}

          {/* MAIN PRODUCT GRID & EMPTY STATES */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-surface-container/20 border-2 border-dashed border-outline-variant rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <ShoppingBag size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">{t("catalog.emptyTitle")}</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-xs font-semibold leading-relaxed">
                  {t("catalog.emptyDesc")}
                </p>
              </div>
              <Button 
                onClick={handleClearAll}
                className="h-13 px-8 rounded-2xl bg-primary hover:bg-primary/95 text-on-primary font-lexend font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all"
              >
                {t("catalog.clearAll")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Catalog pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-outline-variant/60 mt-12">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {t("catalog.showing")} <span className="text-on-surface font-black decoration-primary/30 decoration-2 underline underline-offset-4">{products.length}</span> {t("catalog.of")} <span className="text-on-surface font-black">{totalElements}</span> {t("catalog.gears")}
              </p>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  className="h-11 rounded-xl px-5 font-lexend font-bold uppercase tracking-widest text-[9px] border-outline-variant/60 hover:border-primary disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={14} className="mr-1" />
                  {t("catalog.prev")}
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i)}
                      className={cn(
                        "w-11 h-11 rounded-xl font-lexend font-black text-xs transition-all",
                        page === i
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105"
                          : "border-outline-variant/60 hover:border-primary text-on-surface-variant"
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  className="h-11 rounded-xl px-5 font-lexend font-bold uppercase tracking-widest text-[9px] border-outline-variant/60 hover:border-primary disabled:opacity-30 transition-all"
                >
                  {t("catalog.next")}
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

        </section>
        </div>
      </main>

      {/* ─── MOBILE FILTER DRAWER OVERLAY ────────────────────────────────────── */}
      <MobileFilterDrawer
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedGender={selectedGender}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        minPrice={minPrice}
        maxPrice={maxPrice}
        masterSizes={masterSizes}
        masterColors={masterColors}
        products={products}
        mobileFilterOpen={mobileFilterOpen}
        setMobileFilterOpen={setMobileFilterOpen}
        handleCategorySelect={handleCategorySelect}
        setSelectedGender={setSelectedGender}
        setSelectedBrand={setSelectedBrand}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setPage={setPage}
        handleClearAll={handleClearAll}
      />

      <Footer />
    </div>
  );
}
