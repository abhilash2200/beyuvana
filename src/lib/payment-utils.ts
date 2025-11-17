import { apiFetch } from "./api/core";
import { ENV_CONFIG } from "./constants";
import type {
    PaymentApiResponse,
    PaymentResponseData,
} from "./types/payment";
import {
    extractRedirectUrl,
    isPaymentResponseData,
} from "./types/payment";
import { getNestedProperty, isString } from "./types/guards";

/**
 * Safely extracts redirect URL from an object
 */
const getRedirectFromObject = (obj: Record<string, unknown>): string | null => {
    // Try direct properties first
    const directRedirect = extractRedirectUrl(obj);
    if (directRedirect) {
        return directRedirect;
    }

    // Try nested data property
    const nestedRedirect = getNestedProperty<string>(
        obj,
        ["data", "redirect_url"],
        isString
    ) || getNestedProperty<string>(
        obj,
        ["data", "redirectUrl"],
        isString
    ) || getNestedProperty<string>(
        obj,
        ["data", "redirect_path"],
        isString
    ) || getNestedProperty<string>(
        obj,
        ["data", "redirectPath"],
        isString
    );

    return nestedRedirect || null;
};

export function getRedirectPathFromStatus(response: PaymentApiResponse): string | null {
    if (response.status === true) {
        return "/payment-success";
    } else if (response.status === false) {
        return "/payment-failed";
    }

    if (response && typeof response === "object") {
        const redirect = getRedirectFromObject(response as Record<string, unknown>);
        if (redirect) return redirect;
    }

    return null;
}

export function extractRedirectPath(
    result: unknown,
    response: PaymentApiResponse
): string | null {
    const statusRedirect = getRedirectPathFromStatus(response);
    if (statusRedirect) {
        return statusRedirect;
    }

    // Try to extract from result using type-safe methods
    if (isPaymentResponseData(result)) {
        const redirect = extractRedirectUrl(result);
        if (redirect) {
            return redirect;
        }
    }

    // Fallback to object-based extraction
    if (result && typeof result === "object") {
        const redirect = getRedirectFromObject(result as Record<string, unknown>);
        if (redirect) {
            return redirect;
        }
    }

    return null;
}

const REDIRECT_PATTERNS = [
    /["']redirect_url["']\s*=>\s*["']([^"']+)["']/i,
    /["']redirectUrl["']\s*=>\s*["']([^"']+)["']/i,
    /redirect_url["']?\s*[:=]\s*["']([^"']+)["']/i,
    /redirect_path["']?\s*[:=]\s*["']([^"']+)["']/i,
];

export function parseNonJsonResponse(responseText: string): PaymentApiResponse {
    for (const pattern of REDIRECT_PATTERNS) {
        const match = responseText.match(pattern);
        if (match?.[1]) {
            return { data: { redirect_url: match[1] }, status: true };
        }
    }

    throw new Error("Backend did not provide redirect URL. Please check your orders page.");
}

export async function callPaymentResponseAPI(
    orderId: string
): Promise<PaymentApiResponse> {
    // Build query parameters
    const queryParams = new URLSearchParams({
        payment_request_id: orderId,
    });

    const endpoints = [
        `/api/payment_response/?${queryParams.toString()}`,
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await apiFetch<PaymentResponseData>(
                endpoint,
                { method: "GET" }
            );
            return {
                status: response.status,
                message: response.message,
                code: response.code,
                data: isPaymentResponseData(response.data)
                    ? response.data
                    : response.data ?? null,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            const isJsonParseError =
                errorMessage.includes("parse JSON") ||
                errorMessage.includes("HTML error page");

            // Silently continue to next endpoint if this one fails
            if (isJsonParseError) {
                // Continue to next endpoint
            }
        }
    }

    const directQueryParams = new URLSearchParams({
        payment_request_id: orderId,
    });
    const directUrl = `${ENV_CONFIG.API_BASE_URL}/api/payment_response/?${directQueryParams.toString()}`;
    const fetchResponse = await fetch(directUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!fetchResponse.ok) {
        return {
            status: false,
            message: `Payment verification failed with status ${fetchResponse.status}`,
            code: fetchResponse.status,
            data: null,
        };
    }

    const responseText = await fetchResponse.text();
    const contentType = fetchResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        try {
            const parsedResponse = JSON.parse(responseText) as PaymentApiResponse;
            return {
                status: parsedResponse.status ?? false,
                message: parsedResponse.message,
                code: parsedResponse.code,
                data: isPaymentResponseData(parsedResponse.data)
                    ? parsedResponse.data
                    : (parsedResponse.data as PaymentResponseData | null),
            };
        } catch {
            return parseNonJsonResponse(responseText);
        }
    }

    return parseNonJsonResponse(responseText);
}

export function normalizeRedirectPath(redirectPath: string): string {
    try {
        if (redirectPath.startsWith("http://") || redirectPath.startsWith("https://")) {
            return new URL(redirectPath).pathname;
        }
        return redirectPath.startsWith("/") ? redirectPath : "/" + redirectPath;
    } catch {
        const match = redirectPath.match(/\/payment-(success|failed)/);
        return match?.[0] || (redirectPath.startsWith("/") ? redirectPath : "/" + redirectPath);
    }
}