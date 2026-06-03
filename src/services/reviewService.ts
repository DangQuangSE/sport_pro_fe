import { apiClient, ApiResponse, PageResponse } from "@/lib/api-client";

export interface ReviewResponse {
  id: number;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  images: string[];
  replyComment: string | null;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
  orderItemId: number;
}

export const reviewService = {
  // Public: Get reviews of a specific product
  getProductReviews: (productId: number, page = 0, size = 10) => {
    return apiClient.get<ApiResponse<PageResponse<ReviewResponse>>>(
      `/public/reviews/product/${productId}?page=${page}&size=${size}&sort=createdAt,desc`
    );
  },

  // User: Create a product review
  createReview: (rating: number, comment: string, orderItemId: number, files?: File[]) => {
    const formData = new FormData();
    const reviewData = { rating, comment, orderItemId };
    
    // Append the JSON part as a Blob with application/json content-type
    const reviewBlob = new Blob([JSON.stringify(reviewData)], { type: "application/json" });
    formData.append("review", reviewBlob);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    return apiClient.post<ApiResponse<ReviewResponse>>("/user/reviews", formData);
  },

  // User: Update a product review
  updateReview: (reviewId: number, rating: number, comment: string, orderItemId: number, files?: File[]) => {
    const formData = new FormData();
    const reviewData = { rating, comment, orderItemId };
    
    const reviewBlob = new Blob([JSON.stringify(reviewData)], { type: "application/json" });
    formData.append("review", reviewBlob);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    return apiClient.put<ApiResponse<ReviewResponse>>(`/user/reviews/${reviewId}`, formData);
  },

  // Admin: Get all reviews
  adminGetAllReviews: (page = 0, size = 10) => {
    return apiClient.get<ApiResponse<PageResponse<ReviewResponse>>>(
      `/admin/reviews?page=${page}&size=${size}&sort=createdAt,desc`
    );
  },

  // Admin: Reply to a review
  adminReplyReview: (reviewId: number, replyComment: string) => {
    return apiClient.post<ApiResponse<ReviewResponse>>(`/admin/reviews/${reviewId}/reply`, replyComment, {
      headers: { "Content-Type": "text/plain" }
    });
  },

  // Admin: Delete a review
  adminDeleteReview: (reviewId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/admin/reviews/${reviewId}`);
  }
};
