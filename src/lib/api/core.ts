/**
 * Core API utilities
 * Contains the base apiFetch function with retry logic and error handling
 */

import { API_CONFIG, ENV_CONFIG } from "../constants";
import { isBrowser, shouldRetry, calculateRetryDelay, sleep } from "../api-utils";

export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    success?: boolean;
    error?: string;
    code?: number;
    status?: boolean;
}

export interface RetryConfig {
    maxRetries?: number;
    baseDelay?: number;
    retryableStatusCodes?: number[];
    retryableErrors?: string[];
}

/**
 * Generic API fetch function with timeout, retry logic, and proper error handling
 */
export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig?: RetryConfig
): Promise<ApiResponse<T>> {
    const url = isBrowser
        ? `${ENV_CONFIG.PROXY_URL}?endpoint=${encodeURIComponent(endpoint)}`
        : `${ENV_CONFIG.API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const maxAttempts = (retryConfig?.maxRetries ?? API_CONFIG.MAX_RETRIES) + 1;
    let lastError: Error | unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            signal: controller.signal,
        };

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                const error = new Error(
                    `API error: ${response.status} ${response.statusText} - ${errorText}`
                );

                // Check if we should retry this error
                if (attempt < maxAttempts - 1 && shouldRetry(error, attempt, retryConfig)) {
                    const delay = calculateRetryDelay(attempt, retryConfig?.baseDelay);
                    await sleep(delay);
                    lastError = error;
                    continue;
                }

                throw error;
            }

            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');

            const responseText = await response.text();

            if (responseText.trim().startsWith('<') || responseText.includes('<html') || responseText.includes('<div')) {
                const error = new Error(
                    `Backend returned HTML error page instead of JSON data. This indicates a server error. Status: ${response.status}`
                );

                if (attempt < maxAttempts - 1 && shouldRetry(error, attempt, retryConfig)) {
                    const delay = calculateRetryDelay(attempt, retryConfig?.baseDelay);
                    await sleep(delay);
                    lastError = error;
                    continue;
                }

                throw error;
            }

            if (!isJson) {
                throw new Error(
                    `Expected JSON response but got ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}`
                );
            }

            let data: ApiResponse<T>;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(
                    `Failed to parse JSON response. The server may be returning invalid JSON or HTML. Error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
                );
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            // Handle timeout errors
            if (error instanceof Error && error.name === "AbortError") {
                const timeoutError = new Error(`Request timeout: API call to ${endpoint} took too long (${API_CONFIG.TIMEOUT}ms timeout)`);

                if (attempt < maxAttempts - 1 && shouldRetry(timeoutError, attempt, retryConfig)) {
                    const delay = calculateRetryDelay(attempt, retryConfig?.baseDelay);
                    await sleep(delay);
                    lastError = timeoutError;
                    continue;
                }

                throw timeoutError;
            }

            // Handle network errors
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                const networkError = new Error(
                    `Network error: Unable to connect to ${url}. This might be a CORS issue or the server is unreachable.`
                );

                if (attempt < maxAttempts - 1 && shouldRetry(networkError, attempt, retryConfig)) {
                    const delay = calculateRetryDelay(attempt, retryConfig?.baseDelay);
                    await sleep(delay);
                    lastError = networkError;
                    continue;
                }

                throw networkError;
            }

            // If it's not a retryable error or we've exhausted retries, throw
            if (attempt < maxAttempts - 1 && shouldRetry(error, attempt, retryConfig)) {
                const delay = calculateRetryDelay(attempt, retryConfig?.baseDelay);
                await sleep(delay);
                lastError = error;
                continue;
            }

            throw error;
        }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError || new Error(`Failed to fetch ${endpoint} after ${maxAttempts} attempts`);
}

