/**
 * Payment API Types
 * Type definitions for payment-related API responses
 */

/**
 * Base payment API response structure
 */
export interface PaymentApiResponse {
    /** Payment status (true = success, false = failed) */
    status?: boolean;
    /** Response message */
    message?: string;
    /** HTTP status code */
    code?: number;
    /** Response data */
    data?: PaymentResponseData | null;
}

/**
 * Payment response data structure
 */
export interface PaymentResponseData {
    /** Redirect URL for payment gateway */
    redirect_url?: string;
    redirectUrl?: string;
    redirect_path?: string;
    redirectPath?: string;
    /** Order details */
    order_details?: OrderDetails;
    /** Payment response array */
    payment_response?: PaymentResponseItem | PaymentResponseItem[];
    /** Nested data structure */
    data?: {
        redirect_url?: string;
        redirectUrl?: string;
        redirect_path?: string;
        redirectPath?: string;
    };
}

/**
 * Order details from payment response
 */
export interface OrderDetails {
    /** Order ID */
    id?: string | number;
    /** Payment redirect URL */
    payment_redirect_url?: string;
    /** Order status */
    status?: string;
}

/**
 * Payment response item
 */
export interface PaymentResponseItem {
    /** Order ID */
    orderId?: string;
    /** Redirect URL */
    redirectUrl?: string;
    /** Payment status */
    status?: string;
}

/**
 * Type guard to check if value is a PaymentApiResponse
 */
export function isPaymentApiResponse(value: unknown): value is PaymentApiResponse {
    if (!value || typeof value !== "object") {
        return false;
    }
    const obj = value as Record<string, unknown>;
    return (
        typeof obj.status === "boolean" ||
        typeof obj.status === "undefined" ||
        typeof obj.message === "string" ||
        typeof obj.message === "undefined" ||
        typeof obj.code === "number" ||
        typeof obj.code === "undefined" ||
        obj.data !== undefined
    );
}

/**
 * Type guard to check if value is a PaymentResponseData
 */
export function isPaymentResponseData(value: unknown): value is PaymentResponseData {
    if (!value || typeof value !== "object") {
        return false;
    }
    const obj = value as Record<string, unknown>;
    return (
        typeof obj.redirect_url === "string" ||
        typeof obj.redirectUrl === "string" ||
        typeof obj.redirect_path === "string" ||
        typeof obj.redirectPath === "string" ||
        typeof obj.order_details === "object" ||
        typeof obj.payment_response === "object" ||
        typeof obj.data === "object"
    );
}

/**
 * Type guard to check if value is a PaymentResponseItem
 */
export function isPaymentResponseItem(value: unknown): value is PaymentResponseItem {
    if (!value || typeof value !== "object") {
        return false;
    }
    const obj = value as Record<string, unknown>;
    return (
        typeof obj.orderId === "string" ||
        typeof obj.redirectUrl === "string" ||
        typeof obj.status === "string"
    );
}

/**
 * Type guard to check if value is an OrderDetails object
 */
export function isOrderDetails(value: unknown): value is OrderDetails {
    if (!value || typeof value !== "object") {
        return false;
    }
    const obj = value as Record<string, unknown>;
    return (
        (typeof obj.id === "string" || typeof obj.id === "number") ||
        typeof obj.payment_redirect_url === "string" ||
        typeof obj.status === "string"
    );
}

/**
 * Safely extracts redirect URL from various response structures
 */
export function extractRedirectUrl(data: unknown): string | null {
    if (!data || typeof data !== "object") {
        return null;
    }

    const obj = data as Record<string, unknown>;

    // Check direct properties
    if (typeof obj.redirect_url === "string" && obj.redirect_url) {
        return obj.redirect_url;
    }
    if (typeof obj.redirectUrl === "string" && obj.redirectUrl) {
        return obj.redirectUrl;
    }
    if (typeof obj.redirect_path === "string" && obj.redirect_path) {
        return obj.redirect_path;
    }
    if (typeof obj.redirectPath === "string" && obj.redirectPath) {
        return obj.redirectPath;
    }

    // Check nested data
    if (obj.data && typeof obj.data === "object") {
        const nested = obj.data as Record<string, unknown>;
        if (typeof nested.redirect_url === "string" && nested.redirect_url) {
            return nested.redirect_url;
        }
        if (typeof nested.redirectUrl === "string" && nested.redirectUrl) {
            return nested.redirectUrl;
        }
    }

    // Check order_details
    if (obj.order_details && isOrderDetails(obj.order_details)) {
        if (obj.order_details.payment_redirect_url) {
            return obj.order_details.payment_redirect_url;
        }
    }

    // Check payment_response array
    if (Array.isArray(obj.payment_response) && obj.payment_response.length > 0) {
        const firstItem = obj.payment_response[0];
        if (isPaymentResponseItem(firstItem) && firstItem.redirectUrl) {
            return firstItem.redirectUrl;
        }
    }

    // Check single payment_response object
    if (obj.payment_response && isPaymentResponseItem(obj.payment_response)) {
        if (obj.payment_response.redirectUrl) {
            return obj.payment_response.redirectUrl;
        }
    }

    return null;
}

/**
 * Safely extracts order ID from various response structures
 */
export function extractOrderId(data: unknown): string | null {
    if (!data || typeof data !== "object") {
        return null;
    }

    const obj = data as Record<string, unknown>;

    // Check order_details
    if (obj.order_details && isOrderDetails(obj.order_details)) {
        if (obj.order_details.id) {
            return String(obj.order_details.id);
        }
    }

    // Check payment_response array
    if (Array.isArray(obj.payment_response) && obj.payment_response.length > 0) {
        const firstItem = obj.payment_response[0];
        if (isPaymentResponseItem(firstItem) && firstItem.orderId) {
            return firstItem.orderId;
        }
    }

    // Check single payment_response object
    if (obj.payment_response && isPaymentResponseItem(obj.payment_response)) {
        if (obj.payment_response.orderId) {
            return obj.payment_response.orderId;
        }
    }

    return null;
}

