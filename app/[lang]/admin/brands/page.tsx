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
import { toast } from "sonner";

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
      toast.success(editingBrand ? "Brand updated successfully!" : "Brand created successfully!");
    } else {
      toast.error((result.error as string) || "An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      const result = await deleteBrand(id);
      if (result.success) {
        toast.success("Brand deleted successfully!");
      } else {
        toast.error((result.error as string) || "Failed to delete brand");
      }
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6">
        <div className="flex flex-col gap-1 flex-shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={10} />
              Admin
            </Link>
            <ChevronRight size={10} />
            <span className="text-on-surface">Brands</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Brand <span className="text-primary">Partners</span>
          </h2>
        </div>

        {/* Search bar & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-[260px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
            <Input 
              placeholder="Search brands by name..." 
              className="pl-10 h-10 rounded-xl bg-surface-container-highest/30 border-outline-variant focus:bg-surface focus:border-primary transition-all font-inter text-xs shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="gap-1.5 h-10 px-5 rounded-xl shadow-md hover:shadow-lg transition-all bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto flex-shrink-0"
            onClick={handleOpenCreate}
          >
            <Plus size={14} />
            Add Brand
          </Button>
        </div>
      </div>

      <div className="space-y-6">

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
