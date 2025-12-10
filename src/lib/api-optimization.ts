/**
 * API Optimization Utilities
 * Provides utilities for batching, debouncing, and optimizing API calls
 */

import { apiCache, cachedApiCall } from "./api-cache";

/**
 * Debounce function for API calls
 */
export function debounceApiCall<T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  delay: number,
): (...args: T) => Promise<unknown> {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        timeoutId = null;
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

/**
 * Batch multiple API calls into a single request
 */
export async function batchApiCalls<T>(
  calls: Array<() => Promise<T>>,
  batchSize: number = 5,
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((call) => call()));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Create a cached API call wrapper
 */
export function createCachedApiCall<T>(
  endpoint: string,
  apiCall: () => Promise<T>,
  options?: {
    ttl?: number;
    skipCache?: boolean;
    requestOptions?: RequestInit;
  },
): () => Promise<T> {
  return () =>
    cachedApiCall(endpoint, apiCall, {
      cacheConfig: {
        ttl: options?.ttl,
      },
      requestOptions: options?.requestOptions,
      skipCache: options?.skipCache,
    });
}

/**
 * Invalidate cache for specific endpoint
 */
export function invalidateCache(
  endpoint: string,
  requestOptions?: RequestInit,
): void {
  apiCache.clear(endpoint, requestOptions);
}

/**
 * Clear all API cache
 */
export function clearAllCache(): void {
  apiCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return apiCache.getStats();
}
