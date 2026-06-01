"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  adminService, 
  PrintingMaterial, 
  PrintingMaterialRequest, 
  PrintingPriceConfig, 
  PrintingPriceConfigRequest 
} from "@/services/adminService";

export function usePrinting() {
  const [materials, setMaterials] = useState<PrintingMaterial[]>([]);
  const [priceConfigs, setPriceConfigs] = useState<PrintingPriceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPrintingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [materialsRes, priceConfigsRes] = await Promise.all([
        adminService.getPrintingMaterials(),
        adminService.getPrintingPriceConfigs()
      ]);
      setMaterials(materialsRes.data || []);
      setPriceConfigs(priceConfigsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch printing configurations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrintingData();
  }, [fetchPrintingData]);

  // --- Printing Materials Actions ---
  const createMaterial = async (data: PrintingMaterialRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createPrintingMaterial(data);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create printing material" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMaterial = async (id: number, data: PrintingMaterialRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updatePrintingMaterial(id, data);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update printing material" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMaterial = async (id: number) => {
    setIsSubmitting(true);
    try {
      await adminService.deletePrintingMaterial(id);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete printing material" };
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Printing Price Config Actions ---
  const createPriceConfig = async (data: PrintingPriceConfigRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createPrintingPriceConfig(data);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create price config" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePriceConfig = async (id: number, data: PrintingPriceConfigRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updatePrintingPriceConfig(id, data);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update price config" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePriceConfig = async (id: number) => {
    setIsSubmitting(true);
    try {
      await adminService.deletePrintingPriceConfig(id);
      await fetchPrintingData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete price config" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    materials,
    priceConfigs,
    isLoading,
    isSubmitting,
    fetchPrintingData,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    createPriceConfig,
    updatePriceConfig,
    deletePriceConfig
  };
}
