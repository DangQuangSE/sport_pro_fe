"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, Category, CategoryRequest } from "@/services/adminService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
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
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
