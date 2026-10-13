import { apiClient, ApiResponse } from "@/lib/api-client";

export interface CheckoutQuoteRequest {
  cartItemIds?: number[];
  couponCode?: string;
  shippingAddress?: string;
}

export interface PricingBreakdown {
  subtotalAmount: number;
  printingAmount: number;
  tierDiscountAmount: number;
  couponDiscountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  appliedTierCode?: string | null;
  ruleVersions?: Record<string, number>;
}

export const pricingService = {
  getCheckoutQuote: (request: CheckoutQuoteRequest) =>
    apiClient.post<ApiResponse<PricingBreakdown>>("/v1/checkout/quote", request),
};
