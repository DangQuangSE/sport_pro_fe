"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Home
} from "lucide-react";
import { useBrands } from "@/hooks/admin/useBrands";
import { BrandTable } from "@/components/admin/brands/BrandTable";
import { BrandFormModal } from "@/components/admin/brands/BrandFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function BrandsPage() {
  const { t, locale } = useTranslation();
  const { 
    brands, 
    isLoading, 
    isSubmitting, 
    totalElements,
    createBrand, 
    updateBrand, 
    deleteBrand 
  } = useBrands();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    const result = editingBrand 
      ? await updateBrand(editingBrand.id, data)
      : await createBrand(data);
    
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      const result = await deleteBrand(id);
      if (!result.success) {
        alert("Failed to delete brand");
      }
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant uppercase tracking-widest">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          <Home size={12} />
          Admin
        </Link>
        <ChevronRight size={12} />
        <span className="text-on-surface">Brands</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter text-on-surface uppercase">
            Brands
          </h2>
          <p className="text-on-surface-variant max-w-md">
            Manage the manufacturers and professional brands in your elite sports catalog.
          </p>
        </div>
        <Button className="gap-2 h-12 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={handleOpenCreate}>
          <Plus size={20} />
          Add Brand
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search brands..." 
              className="pl-12 h-12 rounded-2xl bg-surface border-outline-variant focus:border-primary transition-all shadow-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <BrandTable 
          brands={filteredBrands}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </div>

      <BrandFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingBrand}
        brandsCount={brands.length}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
