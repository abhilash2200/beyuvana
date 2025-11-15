/**
 * Checkout API
 * Handles checkout and payment processing
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type { CheckoutRequest, CheckoutResponseData } from "./types";

export const checkoutApi = {
  processCheckout: async (checkoutData: CheckoutRequest, sessionKey?: string): Promise<ApiResponse<CheckoutResponseData>> => {
    try {
      return await apiFetch<CheckoutResponseData>("/api/checkout/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(checkoutData),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to process checkout. Please try again later.");
    }
  },
};

