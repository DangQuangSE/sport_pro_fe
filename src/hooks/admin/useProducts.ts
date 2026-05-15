"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, ProductListResponse, PageResponse } from "@/services/adminService";

export function useProducts() {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = useCallback(async (params?: any) => {
    setIsLoading(true);
    try {
      const response = await adminService.getProducts(params);
      setProducts(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = async (id: number) => {
    try {
      await adminService.deleteProduct(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    products,
    isLoading,
    totalElements,
    fetchProducts,
    deleteProduct
  };
}
