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
            0
        )
    );

    const grossAmount = cartItems.reduce((acc, item) => {
        const originalPrice = item.mrp_price || item.price || 0;
        return acc + Math.round(originalPrice * item.quantity);
    }, 0);

    const paidAmount = total;
    const discountAmount = Math.max(0, grossAmount - paidAmount);
    const totalQty = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

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
export function parseProductId(productId: string | number | undefined): number | null {
    if (!productId) return null;
    const parsed = typeof productId === "string" ? parseInt(productId, 10) : Number(productId);
    return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

/**
 * Transform cart items for checkout
 */
export function transformCartItemsForCheckout(cartItems: LocalCartItem[]): CheckoutCartItem[] {
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
 */
export function getPaymentRedirectUrl(): string {
    return `${ENV_CONFIG.SITE_URL}/payment-initiate`;
}

