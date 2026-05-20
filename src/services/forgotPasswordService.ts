import { apiClient, ApiResponse } from "@/lib/api-client";

export interface ForgotPasswordTokenResponse {
  message: string;
  forgotPasswordToken: string;
}

export const forgotPasswordService = {
  requestOtp: (email: string) => {
    return apiClient.post<ApiResponse<void>>("/forgot-password/request-otp", { email });
  },
  
  verifyOtp: (email: string, otpCode: string) => {
    return apiClient.post<ApiResponse<ForgotPasswordTokenResponse>>("/forgot-password/verify-otp", { email, otpCode });
  },
  
  resetPassword: (forgotPasswordToken: string, newPassword: string) => {
    return apiClient.post<ApiResponse<void>>("/forgot-password/reset", { forgotPasswordToken, newPassword });
  }
};
