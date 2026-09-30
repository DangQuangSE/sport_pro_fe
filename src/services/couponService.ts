import { apiClient, ApiResponse } from "@/lib/api-client";
import { PageResponse } from "@/services/adminService";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT"
}

export enum UserTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface Coupon {
  id: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  requiredTier: UserTier | null;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
  maxUsagePerUser: number | null;
  totalDiscountGiven: number | null;
  isActive: boolean;
}

export interface CouponRequest {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  requiredTier: UserTier | null;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  maxUsagePerUser: number | null;
  isActive: boolean;
}

export interface CouponPreviewResponse {
  id: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

interface ListParams {
  page?: number;
  size?: number;
}

const buildQueryString = (params?: ListParams) => {
  if (!params) return "";
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleanParams[key] = String(value);
    }
  });
  return Object.keys(cleanParams).length > 0 ? `?${new URLSearchParams(cleanParams).toString()}` : "";
};

export const couponService = {
  getAllCoupons: (params?: ListParams) => {
    return apiClient.get<ApiResponse<PageResponse<Coupon>>>(`/v1/admin/coupons${buildQueryString(params)}`);
  },
  createCoupon: (data: CouponRequest) => {
    return apiClient.post<ApiResponse<Coupon>>("/v1/admin/coupons", data);
  },
  updateCoupon: (id: number, data: CouponRequest) => {
    return apiClient.put<ApiResponse<Coupon>>(`/v1/admin/coupons/${id}`, data);
  },
  deleteCoupon: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/v1/admin/coupons/${id}`);
  },
  previewCoupon: (code: string, orderAmount: number) => {
    return apiClient.post<ApiResponse<CouponPreviewResponse>>("/v1/coupons/preview", { code, orderAmount });
  }
};
