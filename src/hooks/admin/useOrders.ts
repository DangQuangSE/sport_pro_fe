"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService } from "@/services/adminService";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = useCallback(async (params?: any) => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllOrders(params);
      setOrders(response.data?.content || []);
      setTotalElements(response.data?.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await adminService.updateOrderStatus(id, status);
      await fetchOrders();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    orders,
    isLoading,
    totalElements,
    fetchOrders,
    updateOrderStatus
  };
}
