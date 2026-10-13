import { apiClient, ApiResponse } from "@/lib/api-client";

export interface UserProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  tier: string; // BRONZE, SILVER, GOLD, PLATINUM
  totalSpending: number;
  membership?: MembershipProfile;
}

export interface MembershipTier {
  id: number;
  code: string;
  displayNames?: Record<string, string>;
  descriptions?: Record<string, string>;
  threshold: number;
  sortOrder: number;
  discountPercentage: number;
  freeShipping: boolean;
  benefits?: Record<string, unknown>;
  active: boolean;
  version: number;
}

export interface MembershipProfile {
  currentTier?: MembershipTier | null;
  nextTier?: MembershipTier | null;
  activeTiers?: MembershipTier[];
  totalSpending: number;
  amountToNextTier?: number | null;
  progressPercentage?: number | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export const profileService = {
  getProfile: () => {
    return apiClient.get<ApiResponse<UserProfileResponse>>("/profiles/me");
  },

  updateProfile: (data: UpdateProfileRequest) => {
    return apiClient.put<ApiResponse<UserProfileResponse>>("/profiles/me", data);
  },

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<ApiResponse<UserProfileResponse>>("/profiles/me/avatar", formData);
  }
};
