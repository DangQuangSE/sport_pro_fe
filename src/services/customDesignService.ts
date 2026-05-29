import { apiClient, ApiResponse } from "@/lib/api-client";

export interface CustomDesignRequest {
  materialId: number;
  numTextLines: number;
  numImages: number;
  metadata: string; // JSON string chứa chi tiết texts & images
}

export interface CustomDesignResponse {
  id: number;
  designImageUrl: string;
  designMetadata: string;
  printingMaterialId: number;
  printingMaterialName: string;
  numTextLines: number;
  numImages: number;
  totalPrintingPrice: number;
  createdAt: string;
}

export const customDesignService = {
  saveDesign: (file: File, data: CustomDesignRequest) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Gửi data dưới dạng Blob với content-type là application/json
    // Đây là cách chuẩn nhất để Spring Boot @RequestPart nhận diện được JSON object
    const dataBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
    formData.append("data", dataBlob);

    return apiClient.post<ApiResponse<CustomDesignResponse>>("/custom-designs", formData);
  }
};
