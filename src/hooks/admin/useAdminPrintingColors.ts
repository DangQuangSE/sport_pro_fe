"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, Color, ColorRequest } from "@/services/adminService";

export function useAdminPrintingColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchColors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getPrintingColors();
      setColors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch printing colors", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const createColor = async (data: ColorRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createPrintingColor(data);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create printing color" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateColor = async (id: number, data: ColorRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updatePrintingColor(id, data);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update printing color" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteColor = async (id: number) => {
    setIsSubmitting(true);
    try {
      await adminService.deletePrintingColor(id);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete printing color" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    colors,
    isLoading,
    isSubmitting,
    fetchColors,
    createColor,
    updateColor,
    deleteColor
  };
}
