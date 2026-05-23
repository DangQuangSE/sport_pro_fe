import { apiClient, ApiResponse, PageResponse } from "@/lib/api-client";

export interface ProductListResponse {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  originalPrice?: number;
  salePrice?: number;
  imageUrl: string;
  categoryName: string;
  brandName: string;
  totalStock: number;
  averageRating: number;
  status: string;
  gender: string;
  availableSizes?: string[];
  availableColors?: string[];
  isFeatured?: boolean;
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  brandName: string;
  categoryName: string;
  gender: string;
  images: ProductImageResponse[];
  variants: ProductVariantResponse[];
}

export interface ProductImageResponse {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  size: string;
  color: string;
  originalPrice: number;
  salePrice: number;
  stockQuantity: number;
  status: string;
}

export const productService = {
  getProducts: (params?: any) => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach(key => {
        const val = params[key];
        if (val !== undefined && val !== null && val !== "") {
          cleanParams[key] = String(val);
        }
      });
    }
    const query = Object.keys(cleanParams).length > 0 ? `?${new URLSearchParams(cleanParams).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<ProductListResponse>>>(`/products${query}`);
  },

  getProductBySlug: (slug: string) => {
    return apiClient.get<ApiResponse<ProductDetailResponse>>(`/products/${slug}`);
  },

  getCategories: () => {
    return apiClient.get<ApiResponse<any[]>>("/categories");
  },

  getCategoryTree: () => {
    return apiClient.get<ApiResponse<any[]>>("/categories/tree");
  },

  getBrands: (params?: any) => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach(key => {
        const val = params[key];
        if (val !== undefined && val !== null && val !== "") {
          cleanParams[key] = String(val);
        }
      });
    }
    const query = Object.keys(cleanParams).length > 0 ? `?${new URLSearchParams(cleanParams).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<any>>>(`/brands${query}`);
  }
};

