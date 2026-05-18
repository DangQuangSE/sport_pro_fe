import { apiClient, ApiResponse } from "@/lib/api-client";

export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  totalAmount: number;
  totalItems: number;
}

export interface CartItemResponse {
  id: number;
  variantId: number;
  productName: string;
  productSlug: string;
  size: string;
  color: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  itemTotal: number;
  customDesignId?: number;
  designImageUrl?: string;
  printingPrice?: number;
}

export interface CartItemRequest {
  variantId: number;
  quantity: number;
  customDesignId?: number;
}

export const cartService = {
  getMyCart: () => {
    return apiClient.get<ApiResponse<CartResponse>>("/carts/me");
  },

  addOrUpdateItem: (data: CartItemRequest) => {
    return apiClient.post<ApiResponse<CartResponse>>("/carts/me/items", data);
  },

  removeItem: (itemId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/carts/me/items/${itemId}`);
  }
};
