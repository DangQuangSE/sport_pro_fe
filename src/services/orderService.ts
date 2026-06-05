import { apiClient, ApiResponse } from "@/lib/api-client";

export enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD"
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED"
}

export interface OrderItemResponse {
  id: number;
  productName: string;
  productSlug: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  itemTotal: number;
  customDesignId?: number;
  designImageUrl?: string;
  backDesignImageUrl?: string;
  isReviewed?: boolean;
}

export interface OrderResponse {
  id: number;
  shippingAddress: string;
  phoneNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderRequest {
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  cartItemIds: number[];
}

export const orderService = {
  placeOrder: (data: OrderRequest) => {
    return apiClient.post<ApiResponse<OrderResponse>>("/v1/orders", data);
  },

  getUserOrders: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<ApiResponse<{ content: OrderResponse[]; totalElements: number; totalPages: number }>>(`/v1/orders${query}`);
  },

  getOrderDetails: (orderId: number) => {
    return apiClient.get<ApiResponse<OrderResponse>>(`/v1/orders/${orderId}`);
  }
};
