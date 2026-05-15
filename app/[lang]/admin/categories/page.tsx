"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Home
} from "lucide-react";
import { useCategories } from "@/hooks/admin/useCategories";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryFormModal } from "@/components/admin/categories/CategoryFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function CategoriesPage() {
  const { t, locale } = useTranslation();
  const { 
    categories, 
    isLoading, 
    isSubmitting, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    const result = editingCategory 
      ? await updateCategory(editingCategory.id, data)
      : await createCategory(data);
    
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const result = await deleteCategory(id);
      if (!result.success) {
        alert("Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
        <span className="text-on-surface">Categories</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Categories <span className="text-primary">System</span>
          </h2>
          <p className="text-on-surface-variant max-w-md font-medium text-sm tracking-tight">
            Structure your professional storefront with hierarchical precision and athletic organization.
          </p>
        </div>
        <Button 
          className="gap-2 h-14 px-8 rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-bold uppercase tracking-widest text-xs"
          onClick={handleOpenCreate}
        >
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container/30 p-6 rounded-3xl border border-outline-variant shadow-sm backdrop-blur-sm">
          <div className="relative w-full md:w-[480px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              placeholder="Search categories by name or slug..." 
              className="pl-14 h-12 rounded-2xl bg-surface-container-highest/50 border-outline-variant/50 focus:bg-surface focus:border-primary transition-all font-inter text-sm shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <CategoryTable 
          categories={filteredCategories}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        categories={categories}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
