"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronRight,
  Home
} from "lucide-react";
import { useCoupons } from "@/hooks/admin/useCoupons";
import { CouponTable } from "@/components/admin/coupons/CouponTable";
import { CouponFormModal } from "@/components/admin/coupons/CouponFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coupon, CouponRequest } from "@/services/couponService";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { toast } from "sonner";

export default function CouponsPage() {
  const { locale } = useTranslation();
  const {
    coupons,
    isLoading,
    isSubmitting,
    togglingIds,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleActive
  } = useCoupons();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CouponRequest) => {
    const result = editingCoupon
      ? await updateCoupon(editingCoupon.id, data)
      : await createCoupon(data);

    if (result.success) {
      setIsModalOpen(false);
      toast.success(editingCoupon ? "Coupon updated successfully!" : "Coupon created successfully!");
    } else {
      toast.error((result.error as Error)?.message || "An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast.success("Coupon deleted successfully!");
      } else {
        toast.error((result.error as Error)?.message || "Failed to delete coupon");
      }
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const result = await toggleActive(coupon);
    if (result.success) {
      toast.success(coupon.isActive ? "Coupon deactivated." : "Coupon activated.");
    } else {
      toast.error((result.error as Error)?.message || "Failed to update coupon");
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6">
        <div className="flex flex-col gap-1 flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={10} />
              Admin
            </Link>
            <ChevronRight size={10} />
            <span className="text-on-surface">Coupons</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Coupon <span className="text-primary">Management</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-[260px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
            <Input
              placeholder="Search by coupon code..."
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
            Add Coupon
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <CouponTable
          coupons={filteredCoupons}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          togglingIds={togglingIds}
        />
      </div>

      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCoupon}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
