import { apiClient, ApiResponse } from "@/lib/api-client";

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  email: string;
}

export interface UserMe {
  email: string;
  role: string;
  authorities: any[];
}

export const authService = {
  requestOtp: (email: string) => {
    return apiClient.post<ApiResponse<void>>("/auth/register/request-otp", { email });
  },

  verifyOtp: (email: string, otpCode: string) => {
    return apiClient.post<ApiResponse<void>>("/auth/verify-otp", { email, otpCode });
  },

  register: (data: any) => {
    return apiClient.post<ApiResponse<void>>("/auth/register", data);
  },

  login: async (data: any) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data);
    if (response.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  },

  logout: async () => {
    await apiClient.post<ApiResponse<void>>("/auth/logout");
    localStorage.removeItem("accessToken");
  },

  getMe: () => {
    return apiClient.get<ApiResponse<UserMe>>("/auth/me");
  }
};
