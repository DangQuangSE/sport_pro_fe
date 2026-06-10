import { apiClient, ApiResponse } from "@/lib/api-client";

// --- Interfaces ---

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface SizeOption {
  id?: number;
  name: string;
  displayOrder: number;
}

export interface SizeGroup {
  id: number;
  name: string;
  description?: string;
  sizes: SizeOption[];
}

export interface SizeGroupRequest {
  name: string;
  description?: string;
  sizes: SizeOption[];
}

export interface ColorRequest {
  name: string;
  hexCode: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  active?: boolean;   // Jackson serializes Java `boolean isActive` as "active"
  isActive?: boolean; // kept for backward compatibility
  isCustomizable?: boolean;
  customizable?: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  isCustomizable?: boolean;
  customizable?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;   // Jackson serializes Java `boolean isActive` as "active"
  isActive?: boolean; // kept for backward compatibility
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ProductListResponse {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  originalPrice?: number;
  salePrice?: number;
  imageUrl?: string;
  categoryName: string;
  brandName: string;
  gender: string;
  status: string;
  totalStock: number;
  averageRating: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const buildQueryString = (params?: any) => {
  if (!params) return "";
  const cleanParams: any = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      cleanParams[key] = params[key];
    }
  });
  return Object.keys(cleanParams).length > 0 ? `?${new URLSearchParams(cleanParams).toString()}` : "";
};

// --- Admin Service ---

export const adminService = {
  // Categories
  getCategories: (params?: any) => {
    return apiClient.get<ApiResponse<PageResponse<Category>>>(`/categories${buildQueryString(params)}`);
  },
  getCategoryTree: () => {
    return apiClient.get<ApiResponse<any>>("/categories/tree");
  },
  createCategory: (data: CategoryRequest) => {
    return apiClient.post<ApiResponse<Category>>("/admin/categories", data);
  },
  updateCategory: (id: number, data: CategoryRequest) => {
    return apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
  },

  // Brands
  getBrands: (params?: any) => {
    return apiClient.get<ApiResponse<PageResponse<Brand>>>(`/brands${buildQueryString(params)}`);
  },
  createBrand: (data: BrandRequest) => {
    return apiClient.post<ApiResponse<Brand>>("/admin/brands", data);
  },
  updateBrand: (id: number, data: BrandRequest) => {
    return apiClient.put<ApiResponse<Brand>>(`/admin/brands/${id}`, data);
  },
  deleteBrand: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/brands/${id}`);
  },

  // Products
  getProducts: (params?: any) => {
    return apiClient.get<ApiResponse<PageResponse<ProductListResponse>>>(`/admin/products${buildQueryString(params)}`);
  },
  getProduct: (id: number) => {
    return apiClient.get<ApiResponse<any>>(`/admin/products/${id}`);
  },
  createProduct: (data: any) => {
    return apiClient.post<ApiResponse<any>>("/admin/products", data);
  },
  updateProduct: (id: number, data: any) => {
    return apiClient.put<ApiResponse<any>>(`/admin/products/${id}`, data);
  },
  deleteProduct: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
  },
  
  // Variants
  createVariant: (productId: number, data: any) => {
    return apiClient.post<ApiResponse<any>>(`/admin/products/${productId}/variants`, data);
  },
  updateVariant: (variantId: number, data: any) => {
    return apiClient.put<ApiResponse<any>>(`/admin/product-variants/${variantId}`, data);
  },
  deleteVariant: (variantId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/product-variants/${variantId}`);
  },

  // Images
  addImage: (productId: number, formData: FormData) => {
    return apiClient.fetch<ApiResponse<any>>(`/admin/products/${productId}/images`, {
      method: "POST",
      body: formData,
      headers: {} // Let browser set Content-Type for multipart
    });
  },
  deleteImage: (imageId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/product-images/${imageId}`);
  },

  // Orders
  getAllOrders: (params?: any) => {
    return apiClient.get<ApiResponse<PageResponse<any>>>(`/v1/admin/orders${buildQueryString(params)}`);
  },
  getOrderDetails: (id: number) => {
    return apiClient.get<ApiResponse<any>>(`/v1/admin/orders/${id}`);
  },
  updateOrderStatus: (id: number, status: string) => {
    return apiClient.fetch<ApiResponse<any>>(`/v1/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  },
  getCustomDesignDetails: (id: number) => {
    return apiClient.get<ApiResponse<any>>(`/admin/custom-designs/${id}`);
  },


  // Colors
  getColors: () => {
    return apiClient.get<ApiResponse<Color[]>>("/colors");
  },
  createColor: (data: ColorRequest) => {
    return apiClient.post<ApiResponse<Color>>("/admin/colors", data);
  },
  updateColor: (id: number, data: ColorRequest) => {
    return apiClient.put<ApiResponse<Color>>(`/admin/colors/${id}`, data);
  },
  deleteColor: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/colors/${id}`);
  },

  // Size Groups
  getSizeGroups: () => {
    return apiClient.get<ApiResponse<SizeGroup[]>>("/admin/size-groups");
  },
  getSizeGroupsPublic: () => {
    return apiClient.get<ApiResponse<SizeGroup[]>>("/size-groups");
  },
  createSizeGroup: (data: SizeGroupRequest) => {
    return apiClient.post<ApiResponse<SizeGroup>>("/admin/size-groups", data);
  },
  updateSizeGroup: (id: number, data: SizeGroupRequest) => {
    return apiClient.put<ApiResponse<SizeGroup>>(`/admin/size-groups/${id}`, data);
  },
  deleteSizeGroup: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/size-groups/${id}`);
  },

  // Batch Variants
  createVariantsBatch: (productId: number, data: any[]) => {
    return apiClient.post<ApiResponse<any[]>>(`/admin/products/${productId}/variants/batch`, data);
  },

  // --- Printing ---
  getPrintingMaterials: () => {
    return apiClient.get<ApiResponse<PrintingMaterial[]>>("/admin/printing/materials");
  },
  createPrintingMaterial: (data: PrintingMaterialRequest) => {
    return apiClient.post<ApiResponse<PrintingMaterial>>("/admin/printing/materials", data);
  },
  updatePrintingMaterial: (id: number, data: PrintingMaterialRequest) => {
    return apiClient.put<ApiResponse<PrintingMaterial>>(`/admin/printing/materials/${id}`, data);
  },
  deletePrintingMaterial: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/printing/materials/${id}`);
  },

  getPrintingPriceConfigs: () => {
    return apiClient.get<ApiResponse<PrintingPriceConfig[]>>("/admin/printing/price-configs");
  },
  createPrintingPriceConfig: (data: PrintingPriceConfigRequest) => {
    return apiClient.post<ApiResponse<PrintingPriceConfig>>("/admin/printing/price-configs", data);
  },
  updatePrintingPriceConfig: (id: number, data: PrintingPriceConfigRequest) => {
    return apiClient.put<ApiResponse<PrintingPriceConfig>>(`/admin/printing/price-configs/${id}`, data);
  },
  deletePrintingPriceConfig: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/printing/price-configs/${id}`);
  },

  // --- Printing Colors ---
  getPrintingColors: () => {
    return apiClient.get<ApiResponse<Color[]>>("/admin/printing/colors");
  },
  createPrintingColor: (data: ColorRequest) => {
    return apiClient.post<ApiResponse<Color>>("/admin/printing/colors", data);
  },
  updatePrintingColor: (id: number, data: ColorRequest) => {
    return apiClient.put<ApiResponse<Color>>(`/admin/printing/colors/${id}`, data);
  },
  deletePrintingColor: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/printing/colors/${id}`);
  },
  getUsers: () => {
    return apiClient.get<ApiResponse<any[]>>("/admin/users");
  },
  updateUserRole: (userId: number, role: "USER" | "ADMIN") => {
    return apiClient.put<ApiResponse<any>>(`/admin/users/${userId}/role`, { role });
  },
  setUserActive: (userId: number, active: boolean) => {
    return apiClient.put<ApiResponse<any>>(`/admin/users/${userId}/active`, { active });
  },
  deleteUser: (userId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/users/${userId}`);
  },

  // Analytics
  getDailyRevenue: (start: string, end: string) => {
    return apiClient.get<ApiResponse<RevenueReportResponse[]>>(`/v1/admin/analytics/revenue?start=${start}&end=${end}`);
  },
  getTopSellingProducts: (limit: number = 10) => {
    return apiClient.get<ApiResponse<TopProductResponse[]>>(`/v1/admin/analytics/top-products?limit=${limit}`);
  },
  getTrendingDesigns: (limit: number = 10) => {
    return apiClient.get<ApiResponse<TrendingDesignResponse[]>>(`/v1/admin/analytics/trending-designs?limit=${limit}`);
  },
  getOrderStatistics: (start: string, end: string) => {
    return apiClient.get<ApiResponse<OrderStatsResponse>>(`/v1/admin/analytics/order-stats?start=${start}&end=${end}`);
  },
};

// --- Printing Interfaces ---
export interface PrintingMaterial {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  active?: boolean;    // Jackson serialize isActive as "active"
  isActive?: boolean;  // support both formats
  createdAt?: string;
  updatedAt?: string;
}

export interface PrintingMaterialRequest {
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
}

export interface PrintingPriceConfig {
  id: number;
  type: "TEXT" | "IMAGE";
  unitPrice: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrintingPriceConfigRequest {
  type: "TEXT" | "IMAGE";
  unitPrice: number;
  description?: string;
}

export interface RevenueReportResponse {
  date: string;
  revenue: number;
}

export interface TopProductResponse {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

export interface TrendingDesignResponse {
  designId: number;
  designImageUrl: string;
  orderCount: number;
}

export interface OrderStatsResponse {
  totalOrders: number;
  statusCounts: Record<string, number>;
}

