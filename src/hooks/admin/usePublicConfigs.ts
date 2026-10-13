"use client";

import { useState, useCallback, useEffect } from "react";
import { adminService, PublicConfig, PublicConfigRequest, PublicConfigUpdateRequest } from "@/services/adminService";
import { ApiError } from "@/lib/api-client";
import { useTranslation } from "@/hooks/useTranslation";

export function usePublicConfigs() {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<PublicConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAdminSettings();
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
      await adminService.createAdminSetting(data);
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || t("admin.publicConfigs.messages.error") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConfig = async (key: string, data: PublicConfigUpdateRequest) => {
    setIsSubmitting(true);
    try {
      const current = configs.find((config) => config.configKey === key);
      if (current?.version === undefined) {
        throw new Error(t("admin.publicConfigs.messages.versionMissing"));
      }
      await adminService.updateAdminSetting(key, {
        ...data,
        expectedVersion: data.expectedVersion ?? current.version,
      });
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 409) await fetchConfigs();
      return { success: false, error: error instanceof ApiError && error.status === 409
        ? t("admin.publicConfigs.messages.conflict")
        : error.message || t("admin.publicConfigs.messages.error") };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteConfig = async (key: string) => {
    try {
      const current = configs.find((config) => config.configKey === key);
      if (current?.version === undefined) {
        throw new Error(t("admin.publicConfigs.messages.versionMissing"));
      }
      await adminService.deleteAdminSetting(key, current.version);
      await fetchConfigs();
      return { success: true };
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 409) await fetchConfigs();
      return { success: false, error: error instanceof ApiError && error.status === 409
        ? t("admin.publicConfigs.messages.conflict")
        : error.message || t("admin.publicConfigs.messages.error") };
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
