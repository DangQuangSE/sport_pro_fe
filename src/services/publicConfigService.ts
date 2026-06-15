import { apiClient, ApiResponse } from "@/lib/api-client";

export const publicConfigService = {
  getConfigsMap: async () => {
    try {
      const response = await apiClient.get<ApiResponse<Record<string, string>>>("/public-configs/map");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch public configs map", error);
      return {};
    }
  },
  getConfigByKey: async (key: string) => {
    try {
      const response = await apiClient.get<ApiResponse<{ configValue: string }>>(`/public-configs/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch public config by key: ${key}`, error);
      return null;
    }
  }
};
