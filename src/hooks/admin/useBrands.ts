"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, Brand, BrandRequest } from "@/services/adminService";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchBrands = useCallback(async (params?: any) => {
    setIsLoading(true);
    try {
      const response = await adminService.getBrands(params);
      setBrands(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const createBrand = async (data: BrandRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createBrand(data);
      await fetchBrands();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBrand = async (id: number, data: BrandRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updateBrand(id, data);
      await fetchBrands();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBrand = async (id: number) => {
    try {
      await adminService.deleteBrand(id);
      await fetchBrands();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    brands,
    isLoading,
    isSubmitting,
    totalElements,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand
  };
}
