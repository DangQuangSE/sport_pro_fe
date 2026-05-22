import { apiClient, ApiResponse } from "@/lib/api-client";

// --- Interfaces ---

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  active?: boolean;   // Jackson serializes Java `boolean isActive` as "active"
  isActive?: boolean; // kept for backward compatibility
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

// --- Admin Service ---

export const adminService = {
  // Categories
  getCategories: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<Category>>>(`/categories${query}`);
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
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<Brand>>>(`/brands${query}`);
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
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<ProductListResponse>>>(`/admin/products${query}`);
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
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<any>>>(`/v1/admin/orders${query}`);
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
};
