import { apiClient, ApiResponse } from "@/lib/api-client";

export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  OTHER = "OTHER"
}

export interface AddressResponse {
  id: number;
  receiverName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
  type: AddressType;
}

export interface AddressRequest {
  receiverName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
  // Never surfaced to the user — the backend defaults new addresses to HOME
  // and preserves the existing type on update when this is omitted.
  type?: AddressType;
}

export const addressService = {
  getMyAddresses: () => {
    return apiClient.get<ApiResponse<AddressResponse[]>>("/v1/addresses");
  },
  createAddress: (data: AddressRequest) => {
    return apiClient.post<ApiResponse<AddressResponse>>("/v1/addresses", data);
  },
  updateAddress: (id: number, data: AddressRequest) => {
    return apiClient.put<ApiResponse<AddressResponse>>(`/v1/addresses/${id}`, data);
  },
  deleteAddress: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/v1/addresses/${id}`);
  },
  setDefaultAddress: (id: number) => {
    return apiClient.patch<ApiResponse<AddressResponse>>(`/v1/addresses/${id}/default`);
  }
};
