/**
 * Cart Utility Functions
 * Shared utility functions for cart operations
 */

import { LocalCartItem } from "@/context/cart/types";
import type { CheckoutCartItem } from "@/lib/api/types";
import { ENV_CONFIG } from "./constants";

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cartItems: LocalCartItem[]) {
  const total = Math.round(
    cartItems.reduce(
      (acc, item) => acc + Math.round((item.price || 0) * item.quantity),
      0,
    ),
  );

  const grossAmount = cartItems.reduce((acc, item) => {
    const originalPrice = item.mrp_price || item.price || 0;
    return acc + Math.round(originalPrice * item.quantity);
  }, 0);

  const paidAmount = total;
  const discountAmount = Math.max(0, grossAmount - paidAmount);
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    total,
    grossAmount,
    paidAmount,
    discountAmount,
    totalQty,
  };
}

/**
 * Parse product ID safely
 */
export function parseProductId(
  productId: string | number | undefined,
): number | null {
  if (!productId) return null;
  const parsed =
    typeof productId === "string" ? parseInt(productId, 10) : Number(productId);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

/**
 * Transform cart items for checkout
 */
export function transformCartItemsForCheckout(
  cartItems: LocalCartItem[],
): CheckoutCartItem[] {
  return cartItems
    .filter((item) => {
      const productId = parseProductId(item.product_id || item.id);
      return productId !== null && item.quantity > 0;
    })
    .map((item) => {
      const originalPrice = item.mrp_price || item.price || 0;
      const totalMrpPrice = Math.round(originalPrice * item.quantity);
      const totalSalePrice = Math.round((item.price || 0) * item.quantity);
      const itemDiscountAmount = Math.round(totalMrpPrice - totalSalePrice);

      const productId = parseProductId(item.product_id || item.id)!;

      return {
        product_id: productId,
        sale_price: Math.round(item.price || 0),
        mrp_price: Math.round(originalPrice),
        sale_unit: 1,
        qty: item.quantity,
        total_mrp_price: totalMrpPrice,
        total_sale_price: totalSalePrice,
        discount_amount: itemDiscountAmount,
      };
    });
}

/**
 * Get payment redirect URL
 * Uses current domain when available (client-side), otherwise falls back to environment variable or localhost
 */
export function getPaymentRedirectUrl(): string {
  // In browser/client-side: use current origin
  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}/payment-initiate`;
  }

  // Server-side: use environment variable or fallback
  return `${ENV_CONFIG.SITE_URL}/payment-initiate`;
}

/**
 * Check if a cart item is a trial pack (1 PC / Pack)
 * Trial packs are identified by unit_name === "Pc"
 *
 * @param item - The cart item to check
 * @returns true if the item is a trial pack, false otherwise
 *
 * @example
 * const item = { unit_name: "Pc", ... };
 * isTrialPackItem(item); // returns true
 */
export function isTrialPackItem(item: LocalCartItem): boolean {
  return item.unit_name === "Pc";
}

/**
 * Check if cart contains any trial pack items
 *
 * @param cartItems - Array of cart items
 * @returns true if at least one item is a trial pack
 *
 * @example
 * const cart = [
 *   { unit_name: "Pc", ... },
 *   { unit_name: "Pack of", ... }
 * ];
 * hasTrialPack(cart); // returns true
 */
export function hasTrialPack(cartItems: LocalCartItem[]): boolean {
  return cartItems.some(isTrialPackItem);
}

/**
 * Check if cart has trial pack mixed with other products
 * Returns true if cart has both trial pack and non-trial pack items
 *
 * This is the key validation function used at checkout to prevent
 * mixing trial packs with regular products.
 *
 * @param cartItems - Array of cart items
 * @returns true if cart contains both trial pack and regular products
 *
 * @example
 * const mixedCart = [
 *   { unit_name: "Pc", ... },      // Trial pack
 *   { unit_name: "Pack of", ... } // Regular product
 * ];
 * hasTrialPackMixedWithOthers(mixedCart); // returns true
 *
 * const trialOnlyCart = [
 *   { unit_name: "Pc", ... },
 *   { unit_name: "Pc", ... }
 * ];
 * hasTrialPackMixedWithOthers(trialOnlyCart); // returns false
 */
export function hasTrialPackMixedWithOthers(
  cartItems: LocalCartItem[]
): boolean {
  const trialPackCount = cartItems.filter(isTrialPackItem).length;
  const nonTrialPackCount = cartItems.filter((item) => !isTrialPackItem).length;
  return trialPackCount > 0 && nonTrialPackCount > 0;
}
