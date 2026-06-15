"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, PublicConfig, PublicConfigRequest, PublicConfigUpdateRequest } from "@/services/adminService";

export function usePublicConfigs() {
  const [configs, setConfigs] = useState<PublicConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getPublicConfigs();
      setConfigs(response.data);
    } catch (error) {
      console.error("Failed to fetch public configs", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const createConfig = async (data: PublicConfigRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.createPublicConfig(data);
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConfig = async (key: string, data: PublicConfigUpdateRequest) => {
    setIsSubmitting(true);
    try {
      await adminService.updatePublicConfig(key, data);
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteConfig = async (key: string) => {
    try {
      await adminService.deletePublicConfig(key);
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || error };
    }
  };

  return {
    configs,
    isLoading,
    isSubmitting,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig
  };
}
