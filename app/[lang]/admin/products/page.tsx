"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Home
} from "lucide-react";
import { useProducts } from "@/hooks/admin/useProducts";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant: "destructive" | "default";
  confirmLabel: string;
};

export default function AdminProductsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const {
    products,
    isLoading,
    totalElements,
    fetchProducts,
    deleteProduct,
    restoreProduct
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false, title: "", message: "", onConfirm: () => {}, variant: "destructive", confirmLabel: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts({
        keyword: searchQuery,
        page: page,
        size: 10
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, page, fetchProducts]);

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: t("admin.products.delete") || "Delete Product",
      message: t("admin.products.confirmDelete") || "Are you sure you want to delete this product?",
      variant: "destructive",
      confirmLabel: t("admin.products.deleteBtn") || "Delete",
      onConfirm: async () => {
        closeConfirm();
        const result = await deleteProduct(id);
        if (result.success) {
          fetchProducts({ page, keyword: searchQuery, size: 10 });
          toast.success(t("admin.products.deleteSuccess") || "Product deleted successfully!");
        } else {
          toast.error(t("admin.products.deleteError") || "Failed to delete product");
        }
      },
    });
  };

  const handleRestore = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: t("admin.products.restore") || "Restore Product",
      message: t("admin.products.confirmRestore") || "Restore this product? It will be set back to Active.",
      variant: "default",
      confirmLabel: t("admin.products.restoreBtn") || "Restore",
      onConfirm: async () => {
        closeConfirm();
        const result = await restoreProduct(id);
        if (result.success) {
          fetchProducts({ page, keyword: searchQuery, size: 10 });
          toast.success(t("admin.products.restoreSuccess") || "Product restored successfully!");
        } else {
          toast.error(t("admin.products.restoreError") || "Failed to restore product");
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    router.push(`/${locale}/admin/products/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6">
        <div className="flex flex-col gap-1 flex-shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={10} />
              ADMIN
            </Link>
            <ChevronRight size={10} />
            <span className="text-on-surface">{t("admin.sidebar.products") || "Products"}</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            {t("admin.products.catalog")?.split(" ")[0] || "Products"}{" "}
            <span className="text-primary">{t("admin.products.catalog")?.split(" ").slice(1).join(" ") || "Catalog"}</span>
          </h2>
        </div>

        {/* Search, Filter, Sort and Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-[260px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
            <Input
              placeholder={t("admin.products.search") || "Search products by name, SKU..."}
              className="pl-10 h-10 rounded-xl bg-surface-container-highest/30 border-outline-variant focus:bg-surface focus:border-primary transition-all font-inter text-xs shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-1.5 h-10 rounded-xl border-outline-variant hover:border-primary transition-all text-xs font-bold w-full sm:w-auto px-3">
              <Filter size={14} />
              {t("admin.products.filter") || "Filters"}
            </Button>
            <Button variant="outline" className="gap-1.5 h-10 rounded-xl border-outline-variant hover:border-primary transition-all text-xs font-bold w-full sm:w-auto px-3">
              <ArrowUpDown size={14} />
              {t("admin.products.sort") || "Sort"}
            </Button>
            <Button
              className="gap-1.5 h-10 px-5 rounded-xl shadow-md hover:shadow-lg transition-all bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto flex-shrink-0"
              onClick={() => router.push(`/${locale}/admin/products/new`)}
            >
              <Plus size={14} />
              {t("admin.products.create") || "New Product"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Table Area */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onRestore={handleRestore}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-t border-outline-variant/30 mt-4">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            {t("catalog.showing") || "Showing"}{" "}
            <span className="text-on-surface underline decoration-primary/30 decoration-2 underline-offset-4">{products.length}</span>{" "}
            {t("catalog.of") || "of"} <span className="text-on-surface">{totalElements}</span>{" "}
            {t("catalog.gears") || "professional products"}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-11 rounded-xl px-6 font-lexend font-bold uppercase tracking-widest text-[10px] border-outline-variant hover:border-primary transition-all disabled:opacity-30"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              {t("catalog.prev") || "Previous"}
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(totalElements / 10) }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-11 h-11 rounded-xl font-lexend font-black text-xs transition-all",
                    page === i
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/30 scale-105"
                      : "border-outline-variant hover:border-primary text-on-surface-variant"
                  )}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-11 rounded-xl px-6 font-lexend font-bold uppercase tracking-widest text-[10px] border-outline-variant hover:border-primary transition-all disabled:opacity-30"
              disabled={(page + 1) * 10 >= totalElements}
              onClick={() => setPage(page + 1)}
            >
              {t("catalog.next") || "Next"}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        title={confirmState.title}
        footer={
          <>
            <Button variant="outline" onClick={closeConfirm} className="rounded-xl font-bold h-10">
              {t("admin.products.cancelBtn") || "Cancel"}
            </Button>
            <Button variant={confirmState.variant} onClick={confirmState.onConfirm} className="rounded-xl font-bold h-10 shadow-md">
              {confirmState.confirmLabel}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{confirmState.message}</p>
      </Modal>
    </div>
  );
}
