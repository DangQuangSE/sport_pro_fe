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
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function AdminProductsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { 
    products, 
    isLoading, 
    totalElements, 
    fetchProducts, 
    deleteProduct 
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        fetchProducts({ page, keyword: searchQuery, size: 10 });
      } else {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant uppercase tracking-widest">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          <Home size={12} />
          Admin
        </Link>
        <ChevronRight size={12} />
        <span className="text-on-surface">Products</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Inventory <span className="text-primary">Control</span>
          </h2>
          <p className="text-on-surface-variant max-w-md font-medium text-sm tracking-tight">
            Manage your high-performance gear, multi-dimensional variants, and real-time stock levels with professional precision.
          </p>
        </div>
        <Button 
          className="gap-2 h-14 px-8 rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-bold uppercase tracking-widest text-xs"
          onClick={() => router.push(`/${locale}/admin/products/new`)}
        >
          <Plus size={20} />
          Create Product
        </Button>
      </div>

      <div className="space-y-6">
        {/* Filters Area */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container/30 p-6 rounded-3xl border border-outline-variant shadow-sm backdrop-blur-sm">
          <div className="relative w-full md:w-[480px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              placeholder="Search by name, SKU or slug..." 
              className="pl-14 h-12 rounded-2xl bg-surface-container-highest/50 border-outline-variant/50 focus:bg-surface focus:border-primary transition-all font-inter text-sm shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" className="gap-2 h-11 rounded-xl flex-grow md:flex-grow-0">
              <Filter size={16} />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-11 rounded-xl flex-grow md:flex-grow-0">
              <ArrowUpDown size={16} />
              Sort
            </Button>
          </div>
        </div>

        {/* Table Area */}
        <ProductTable 
          products={products}
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-t border-outline-variant/30 mt-4">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Showing <span className="text-on-surface underline decoration-primary/30 decoration-2 underline-offset-4">{products.length}</span> of <span className="text-on-surface">{totalElements}</span> professional products
          </p>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-11 rounded-xl px-6 font-lexend font-bold uppercase tracking-widest text-[10px] border-outline-variant hover:border-primary transition-all disabled:opacity-30"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
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
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
