/**
 * Promo API
 * Handles promo code operations
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";

export interface PromoDetailsRequest {
  user_id: number;
  promo_code: string;
}

export interface PromoDetailsResponse {
  /** Promo value/amount (can be number or string) */
  promo_value?: number | string;
  /** Promo amount (alternative field name) */
  promo_amount?: number | string;
  /** Discount amount (alternative field name) */
  discount_amount?: number | string;
  /** Promo code */
  promo_code?: string;
  /** Promo status */
  status?: boolean;
  /** Additional fields */
  [key: string]: unknown;
}

export const promoApi = {
  getPromoDetails: async (
    promoData: PromoDetailsRequest,
    sessionKey?: string
  ): Promise<ApiResponse<PromoDetailsResponse>> => {
    try {
      const headers = buildAuthHeaders(sessionKey);
      // Add accept header as required by the API
      headers["accept"] = "application/json";

      const response = await apiFetch<PromoDetailsResponse>("/api/promo_details", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: promoData.user_id,
          promo_code: promoData.promo_code,
        }),
      });

      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get promo details. Please try again later."
      );
    }
  },
};

