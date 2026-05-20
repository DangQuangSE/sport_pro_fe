"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, Category, CategoryRequest } from "@/services/adminService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [totalElements, setTotalElements] = useState(0);

  const fetchCategories = useCallback(async (params?: any) => {
    setIsLoading(true);
    try {
      // Default to a large size so we get all categories in administration
      const response = await adminService.getCategories({ size: 1000, ...params });
      const data = response.data;
      
      if (Array.isArray(data)) {
        setCategories(data);
        setTotalElements(data.length);
      } else if (data && Array.isArray(data.content)) {
        setCategories(data.content);
        setTotalElements(data.totalElements ?? data.content.length);
      } else {
        setCategories([]);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setCategories([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data: CategoryRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createCategory(data);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async (id: number, data: CategoryRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updateCategory(id, data);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await adminService.deleteCategory(id);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    categories,
    isLoading,
    isSubmitting,
    totalElements,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
