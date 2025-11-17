/**
 * Type Definitions Index
 * Central export point for all type definitions and utilities
 */

// Payment types
export type {
    PaymentApiResponse,
    PaymentResponseData,
    OrderDetails,
    PaymentResponseItem,
} from "./payment";

export {
    isPaymentApiResponse,
    isPaymentResponseData,
    isPaymentResponseItem,
    isOrderDetails,
    extractRedirectUrl,
    extractOrderId,
} from "./payment";

// Type guards
export {
    isString,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    isNonEmptyString,
    isValidUrl,
    hasProperty,
    hasProperties,
    getProperty,
    getNestedProperty,
    isRecord,
    isRecordOf,
} from "./guards";

