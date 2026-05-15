import { apiClient, ApiResponse, PageResponse } from "@/lib/api-client";

export interface ProductListResponse {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  imageUrl: string;
  categoryName: string;
  brandName: string;
  totalStock: number;
  averageRating: number;
  status: string;
  gender: string;
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
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
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
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<PageResponse<any>>>(`/brands${query}`);
  }
};
