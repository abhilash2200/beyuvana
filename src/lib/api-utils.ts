/**
 * Shared API utilities
 * Contains helper functions for API operations
 */

import { API_CONFIG } from "./constants";

// Environment detection
export const isBrowser = typeof window !== "undefined";

/**
 * Builds authentication headers for API requests
 * @param sessionKey - Optional session key for authenticated requests
 * @returns Record of headers to include in request
 */
export function buildAuthHeaders(sessionKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (sessionKey) {
        // Only include headers that the backend actually requires
        // Based on testing, these are the ones that work:
        headers["session_key"] = sessionKey;
        headers["sessionkey"] = sessionKey; // Some endpoints expect lowercase
        headers["Authorization"] = `Bearer ${sessionKey}`;
    }

    return headers;
}

/**
 * Validates environment variables are set correctly
 * @throws Error if required environment variables are missing
 */
export function validateEnvironment(): void {
    const errors: string[] = [];

    if (!process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_PROXY_URL) {
        errors.push("Either NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_PROXY_URL must be set");
    }

    if (errors.length > 0) {
        throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
    }
}

/**
 * Retry configuration for API requests
 */
export interface RetryConfig {
    maxRetries?: number;
    baseDelay?: number;
    retryableStatusCodes?: number[];
    retryableErrors?: string[];
}

/**
 * Checks if an error should trigger a retry
 */
export function shouldRetry(
    error: unknown,
    attempt: number,
    config: RetryConfig = {}
): boolean {
    const {
        maxRetries = API_CONFIG.MAX_RETRIES,
        retryableStatusCodes = API_CONFIG.RETRY_STATUS_CODES,
        retryableErrors = ["timeout", "network", "ECONNRESET", "ETIMEDOUT"],
    } = config;

    if (attempt >= maxRetries) {
        return false;
    }

    // Check if error is a retryable status code
    if (error instanceof Error) {
        const statusMatch = error.message.match(/\b(\d{3})\b/);
        if (statusMatch) {
            const statusCode = parseInt(statusMatch[1], 10);
            if ((retryableStatusCodes as readonly number[]).includes(statusCode)) {
                return true;
            }
        }

        // Check if error message contains retryable keywords
        const errorMessage = error.message.toLowerCase();
        if (retryableErrors.some((retryable) => errorMessage.includes(retryable))) {
            return true;
        }
    }

    return false;
}

/**
 * Calculates delay for exponential backoff retry
 */
export function calculateRetryDelay(attempt: number, baseDelay: number = API_CONFIG.RETRY_DELAY_BASE): number {
    // Exponential backoff: baseDelay * 2^attempt
    // Add jitter to prevent thundering herd
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
    return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

