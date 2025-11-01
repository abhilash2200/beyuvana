/**
 * Main API Index
 * Re-exports all API modules for backward compatibility
 */

// Core API utilities
export { apiFetch, type ApiResponse, type RetryConfig } from "./core";

// API Modules
export { authApi } from "./auth";
export { productsApi, convertToLegacyProduct } from "./products";
export { cartApi } from "./cart";
export { ordersApi, orderDetailsApi } from "./orders";
export { addressApi } from "./address";
export { checkoutApi } from "./checkout";
export { reviewApi } from "./reviews";
export { contactApi } from "./contact";

// Type exports
export type * from "./types";

