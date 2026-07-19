"use client";

import { useState, useCallback, useEffect } from "react";
import { couponService, Coupon, CouponRequest } from "@/services/couponService";

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const fetchCoupons = useCallback(async (params?: { page?: number; size?: number }) => {
    setIsLoading(true);
    try {
      const response = await couponService.getAllCoupons(params);
      setCoupons(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const createCoupon = async (data: CouponRequest) => {
    setIsSubmitting(true);
    try {
      await couponService.createCoupon(data);
      await fetchCoupons();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCoupon = async (id: number, data: CouponRequest) => {
    setIsSubmitting(true);
    try {
      await couponService.updateCoupon(id, data);
      await fetchCoupons();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCoupon = async (id: number) => {
    try {
      await couponService.deleteCoupon(id);
      await fetchCoupons();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    setTogglingIds((prev) => new Set(prev).add(coupon.id));
    try {
      await couponService.updateCoupon(coupon.id, {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        requiredTier: coupon.requiredTier,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit,
        maxUsagePerUser: coupon.maxUsagePerUser,
        isActive: !coupon.isActive
      });
      await fetchCoupons();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(coupon.id);
        return next;
      });
    }
  };

  return {
    coupons,
    isLoading,
    isSubmitting,
    totalElements,
    togglingIds,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleActive
  };
}
