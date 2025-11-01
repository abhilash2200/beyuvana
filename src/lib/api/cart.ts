/**
 * Cart API
 * Handles cart operations: add, remove, update, get
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type {
  AddToCartRequest,
  CartItem,
} from "./types";

export const cartApi = {
  addToCart: async (
    cartData: AddToCartRequest & { price_qty?: number; price_unit_name?: string },
    sessionKey?: string,
    userId?: string | number
  ): Promise<ApiResponse<CartItem[]>> => {
    try {
      const payload = {
        user_id: userId != null ? Number(userId) : undefined,
        product_id: Number(cartData.product_id),
        product_price_id: cartData.product_price_id ? Number(cartData.product_price_id) : undefined,
        qty: Number(cartData.quantity),
        price_qty: cartData.price_qty ?? 0,
        price_unit_name: cartData.price_unit_name ?? ""
      };

      const response = await apiFetch<CartItem[]>("/cart/add/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(payload),
      });

      return response;
    } catch {
      throw new Error("Failed to add item to cart. Please try again later.");
    }
  },

  getCart: async (sessionKey?: string, userId?: string | number): Promise<ApiResponse<CartItem[]>> => {
    try {
      const payload = {
        user_id: userId ? Number(userId) : undefined,
        limit: 0
      };

      const response = await apiFetch<CartItem[]>("/cart/lists/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      // Check if it's a 401 error (authentication issue)
      if (error instanceof Error && error.message.includes("401")) {
        return {
          data: [],
          status: false,
          message: "Please log in to sync your cart.",
        };
      }

      // Return empty array as fallback for other errors
      return {
        data: [],
        status: false,
        message: "Failed to fetch cart items. Using local cart.",
      };
    }
  },

  updateCart: async (cartData: AddToCartRequest, sessionKey?: string, userId?: string | number): Promise<ApiResponse<CartItem[]>> => {
    return await cartApi.addToCart(cartData, sessionKey, userId);
  },

  removeFromCart: async (productId: string, sessionKey?: string, userId?: string | number, cartId?: string): Promise<ApiResponse<CartItem[]>> => {
    try {
      const payload = {
        user_id: userId ? Number(userId) : undefined,
        product_id: Number(productId),
        cart_id: cartId ? Number(cartId) : undefined
      };

      return await apiFetch<CartItem[]>("/cart/removeone/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        "Failed to remove item from cart. Please try again later."
      );
    }
  },

  decreaseQuantity: async (productId: string, sessionKey?: string): Promise<ApiResponse<CartItem[]>> => {
    try {
      return await apiFetch<CartItem[]>("/cart/removeone/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify({ product_id: productId }),
      });
    } catch {
      throw new Error("Failed to decrease quantity. Please try again later.");
    }
  },

  clearCart: async (sessionKey?: string): Promise<ApiResponse<CartItem[]>> => {
    try {
      return await apiFetch<CartItem[]>("/cart/remove/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify({}),
      });
    } catch {
      throw new Error("Failed to clear cart. Please try again later.");
    }
  },

  removeAllFromCart: async (userId: number, sessionKey?: string): Promise<ApiResponse<CartItem[]>> => {
    try {
      const payload = {
        user_id: userId,
      };

      return await apiFetch<CartItem[]>("/cart/remove/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Failed to remove all items from cart. Please try again later.");
    }
  },
};

