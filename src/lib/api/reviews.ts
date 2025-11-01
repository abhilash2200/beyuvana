/**
 * Reviews API
 * Handles product reviews and ratings
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import { ordersApi } from "./orders";
import type {
  ProductReviewRequest,
  ReviewsListResponse,
} from "./types";

export const reviewApi = {
  /**
   * Check if a user can review a product (has a delivered order for it)
   * Returns: { canReview: boolean, reason?: string, orderStatus?: string }
   */
  canUserReview: async (
    productId: string | number,
    userId: string | number,
    sessionKey?: string
  ): Promise<{ canReview: boolean; reason?: string; orderStatus?: string }> => {
    try {
      // Fetch all user orders to check if they have a delivered order for this product
      const response = await ordersApi.getOrderList(sessionKey, String(userId));

      if (!response.data || !Array.isArray(response.data)) {
        return {
          canReview: false,
          reason: "Unable to verify order status. Please try again later.",
        };
      }

      const productIdStr = String(productId);

      // Check if user has any order for this product
      const productOrders = response.data.filter(
        (order) => order.product_id === productIdStr
      );

      if (productOrders.length === 0) {
        return {
          canReview: false,
          reason: "You can only review products you have ordered. Please purchase this product first.",
        };
      }

      // Check if user has a delivered order for this product
      const deliveredOrders = productOrders.filter(
        (order) => order.status === "delivered"
      );

      if (deliveredOrders.length > 0) {
        return {
          canReview: true,
          orderStatus: "delivered",
        };
      }

      // Check if all orders are cancelled
      const cancelledOrders = productOrders.filter(
        (order) => order.status === "cancelled"
      );

      if (cancelledOrders.length === productOrders.length) {
        return {
          canReview: false,
          reason: "Reviews are not allowed for cancelled or failed orders. Please place a new order.",
          orderStatus: "cancelled",
        };
      }

      // Orders exist but are not yet delivered
      return {
        canReview: false,
        reason: "You can only review products after your order has been delivered. Please wait for delivery.",
        orderStatus: "arriving",
      };
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Error checking review eligibility:", error);
      }
      
      return {
        canReview: false,
        reason: "Unable to verify order status. Please try again later.",
      };
    }
  },
  
  addReview: async (reviewData: ProductReviewRequest, sessionKey?: string): Promise<ApiResponse> => {
    try {
      return await apiFetch("/product-reviews/add/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(reviewData),
      });
    } catch {
      throw new Error("Failed to submit review. Please try again later.");
    }
  },
  
  getReviews: async (
    productId: number,
    sessionKey?: string
  ): Promise<ApiResponse<ReviewsListResponse>> => {
    try {
      return await apiFetch<ReviewsListResponse>("/product-reviews/lists/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify({ product_id: productId }),
      });
    } catch {
      return {
        data: { reviews: [] },
        status: false,
        message: "Failed to fetch reviews",
      } as ApiResponse<ReviewsListResponse>;
    }
  },
};

