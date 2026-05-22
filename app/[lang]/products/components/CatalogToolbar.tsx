"use client";

import React from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CatalogToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setMobileFilterOpen: (open: boolean) => void;
  hasActiveFilters: boolean;
}

export default function CatalogToolbar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  setPage,
  setMobileFilterOpen,
  hasActiveFilters,
}: CatalogToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-surface-container/20 p-4 rounded-2xl border border-outline-variant/60 shadow-sm backdrop-blur-md">
      {/* Interactive debounced search */}
      <div className="relative flex-grow max-w-md group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
          size={16}
        />
        <Input
          placeholder={t("catalog.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-11 bg-surface-container-lowest border-outline-variant/60 focus:border-primary rounded-xl font-medium text-xs shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {/* Mobile Filter Button */}
        <Button
          onClick={() => setMobileFilterOpen(true)}
          variant="outline"
          className="lg:hidden gap-2 h-11 rounded-xl border-outline-variant/60 hover:border-primary text-xs"
        >
          <Filter size={16} />
          {t("catalog.mobileFiltersTitle")}
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
        </Button>

        {/* Sorting Selection Dropdown */}
        <div className="relative flex items-center gap-2">
          <ArrowUpDown size={14} className="text-on-surface-variant hidden xs:block" />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(0);
            }}
            className="h-11 px-4 bg-surface-container-lowest border border-outline-variant/60 hover:border-primary rounded-xl text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="newest">{t("catalog.sorting.newest")}</option>
            <option value="priceAsc">{t("catalog.sorting.priceAsc")}</option>
            <option value="priceDesc">{t("catalog.sorting.priceDesc")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
