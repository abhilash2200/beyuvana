/**
 * Promo code utilities
 * Centralized promo code management
 */

import { PROMO_CONFIG } from "./constants";

/**
 * Gets the promo code to use for prepaid orders
 * @returns Promo code string, or empty string if disabled
 */
export function getPrepaidPromoCode(): string {
  // Return empty string if auto-apply is disabled
  if (!PROMO_CONFIG.AUTO_APPLY_PROMO) {
    return "";
  }

  return PROMO_CONFIG.PREPAID_PROMO_CODE || "";
}

/**
 * Checks if promo code is enabled and configured
 * @returns true if promo code should be applied
 */
export function isPromoCodeEnabled(): boolean {
  return PROMO_CONFIG.AUTO_APPLY_PROMO && !!PROMO_CONFIG.PREPAID_PROMO_CODE;
}
