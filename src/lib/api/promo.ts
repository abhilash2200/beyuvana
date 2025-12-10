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
  promo_value?: number | string;
  promo_amount?: number | string;
  discount_amount?: number | string;
  promo_code?: string;
  status?: boolean;
  [key: string]: unknown;
}

export const promoApi = {
  getPromoDetails: async (
    promoData: PromoDetailsRequest,
    sessionKey?: string,
  ): Promise<ApiResponse<PromoDetailsResponse>> => {
    try {
      const { cachedApiCall } = await import("../api-cache");
      const headers = buildAuthHeaders(sessionKey);
      headers["accept"] = "application/json";

      const endpoint = "/api/promo_details";
      const requestOptions = {
        method: "POST" as const,
        headers,
        body: JSON.stringify({
          user_id: promoData.user_id,
          promo_code: promoData.promo_code,
        }),
      };

      return await cachedApiCall(
        endpoint,
        () => apiFetch<PromoDetailsResponse>(endpoint, requestOptions),
        {
          cacheConfig: {
            ttl: 60 * 1000,
          },
          requestOptions,
        },
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get promo details. Please try again later.",
      );
    }
  },
};
