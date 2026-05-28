"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, Color, ColorRequest } from "@/services/adminService";

export function useColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchColors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getColors();
      setColors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch colors", error);
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
      await adminService.createColor(data);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create color" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateColor = async (id: number, data: ColorRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updateColor(id, data);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update color" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteColor = async (id: number) => {
    setIsSubmitting(true);
    try {
      await adminService.deleteColor(id);
      await fetchColors();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete color" };
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
