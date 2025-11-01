/**
 * Checkout API
 * Handles checkout and payment processing
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type { CheckoutRequest } from "./types";

export const checkoutApi = {
  processCheckout: async (checkoutData: CheckoutRequest, sessionKey?: string): Promise<ApiResponse> => {
    try {
      return await apiFetch("/api/checkout/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(checkoutData),
      });
    } catch {
      throw new Error("Failed to process checkout. Please try again later.");
    }
  },
};

