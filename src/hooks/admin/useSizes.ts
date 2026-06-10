"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, SizeGroup, SizeGroupRequest } from "@/services/adminService";

export function useSizes() {
  const [sizeGroups, setSizeGroups] = useState<SizeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSizes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getSizeGroups();
      setSizeGroups(response.data || []);
    } catch (error) {
      console.error("Failed to fetch size groups", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const createSizeGroup = async (data: SizeGroupRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createSizeGroup(data);
      await fetchSizes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create size group" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSizeGroup = async (id: number, data: SizeGroupRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updateSizeGroup(id, data);
      await fetchSizes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update size group" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSizeGroup = async (id: number) => {
    setIsSubmitting(true);
    try {
      await adminService.deleteSizeGroup(id);
      await fetchSizes();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete size group" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sizeGroups,
    isLoading,
    isSubmitting,
    fetchSizes,
    createSizeGroup,
    updateSizeGroup,
    deleteSizeGroup
  };
}
