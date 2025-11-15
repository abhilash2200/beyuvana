import { apiFetch } from "./api/core";
import { ENV_CONFIG } from "./constants";

interface PaymentApiResponse {
    data?: unknown;
    status?: boolean;
    message?: string;
    code?: number;
}

const getNestedValue = (obj: unknown, paths: string[]): unknown => {
    if (!obj || typeof obj !== "object") return null;
    let current: unknown = obj;
    for (const path of paths) {
        if (current && typeof current === "object" && path in current) {
            current = (current as Record<string, unknown>)[path];
        } else {
            return null;
        }
    }
    return current;
};

const getRedirectFromObject = (obj: Record<string, unknown>): string | null => {
    const redirectUrl =
        obj.redirect_url ||
        obj.redirectUrl ||
        obj.redirect_path ||
        obj.redirectPath ||
        getNestedValue(obj, ["data", "redirect_url"]) ||
        getNestedValue(obj, ["data", "redirectUrl"]) ||
        getNestedValue(obj, ["data", "redirect_path"]) ||
        getNestedValue(obj, ["data", "redirectPath"]);

    return typeof redirectUrl === "string" && redirectUrl ? redirectUrl : null;
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

export function extractRedirectPath(result: unknown, response: PaymentApiResponse): string | null {
    const statusRedirect = getRedirectPathFromStatus(response);
    if (statusRedirect) {
        return statusRedirect;
    }

    if (result && typeof result === "object") {
        const redirect = getRedirectFromObject(result as Record<string, unknown>);
        if (redirect) return redirect;
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

export async function callPaymentResponseAPI(orderId: string, promoCode?: string): Promise<PaymentApiResponse> {
    // Build query parameters
    const queryParams = new URLSearchParams({
        payment_request_id: orderId,
    });

    // Add promo_code if provided
    if (promoCode) {
        queryParams.append("promo_code", promoCode);
    }

    const endpoints = [
        `/api/payment_response/?${queryParams.toString()}`,
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await apiFetch<unknown>(endpoint, { method: "GET" });
            return {
                status: response.status,
                message: response.message,
                code: response.code,
                data: response.data,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isJsonParseError = errorMessage.includes("parse JSON") || errorMessage.includes("HTML error page");

            // Silently continue to next endpoint if this one fails
            if (isJsonParseError) {
                // Continue to next endpoint
            }
        }
    }

    const directUrl = `${ENV_CONFIG.API_BASE_URL}/api/payment_response/?${queryParams.toString()}`;
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
            const parsedResponse = JSON.parse(responseText);
            return {
                status: parsedResponse.status ?? false,
                message: parsedResponse.message,
                code: parsedResponse.code,
                data: parsedResponse.data,
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