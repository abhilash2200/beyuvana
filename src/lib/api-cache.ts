/**
 * API Cache and Request Deduplication System
 * Prevents duplicate API calls and caches responses
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    promise?: Promise<T>;
}

interface CacheConfig {
    ttl?: number; // Time to live in milliseconds
    maxSize?: number; // Maximum cache entries
}

class ApiCache {
    private cache = new Map<string, CacheEntry<unknown>>();
    private pendingRequests = new Map<string, Promise<unknown>>();
    private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
    private readonly defaultMaxSize = 100;

    /**
     * Generate cache key from endpoint and options
     */
    private generateKey(endpoint: string, options?: RequestInit): string {
        const method = options?.method || "GET";
        const body = options?.body ? JSON.stringify(options.body) : "";
        return `${method}:${endpoint}:${body}`;
    }

    /**
     * Check if cache entry is still valid
     */
    private isValid<T>(entry: CacheEntry<T>, ttl: number): boolean {
        return Date.now() - entry.timestamp < ttl;
    }

    /**
     * Clean expired entries and enforce max size
     */
    private cleanup(config: CacheConfig): void {
        const ttl = config.ttl ?? this.defaultTTL;
        const maxSize = config.maxSize ?? this.defaultMaxSize;

        // Remove expired entries
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp >= ttl) {
                this.cache.delete(key);
            }
        }

        // Enforce max size (remove oldest entries)
        if (this.cache.size > maxSize) {
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toRemove = entries.slice(0, this.cache.size - maxSize);
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
    }

    /**
     * Get cached data or return null if not found/invalid
     */
    get<T>(endpoint: string, options?: RequestInit, config?: CacheConfig): T | null {
        const key = this.generateKey(endpoint, options);
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;
        const ttl = config?.ttl ?? this.defaultTTL;

        if (!entry) {
            return null;
        }

        if (!this.isValid(entry, ttl)) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set cache entry
     */
    set<T>(endpoint: string, data: T, options?: RequestInit, config?: CacheConfig): void {
        const key = this.generateKey(endpoint, options);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });

        if (config) {
            this.cleanup(config);
        }
    }

    /**
     * Check if there's a pending request for this endpoint
     */
    getPendingRequest<T>(endpoint: string, options?: RequestInit): Promise<T> | null {
        const key = this.generateKey(endpoint, options);
        return (this.pendingRequests.get(key) as Promise<T> | undefined) || null;
    }

    /**
     * Store pending request to deduplicate
     */
    setPendingRequest<T>(endpoint: string, promise: Promise<T>, options?: RequestInit): void {
        const key = this.generateKey(endpoint, options);
        this.pendingRequests.set(key, promise);

        // Clean up after promise resolves/rejects
        promise
            .finally(() => {
                this.pendingRequests.delete(key);
            });
    }

    /**
     * Clear cache for specific endpoint or all cache
     */
    clear(endpoint?: string, options?: RequestInit): void {
        if (endpoint) {
            const key = this.generateKey(endpoint, options);
            this.cache.delete(key);
            this.pendingRequests.delete(key);
        } else {
            this.cache.clear();
            this.pendingRequests.clear();
        }
    }

    /**
     * Clear expired entries
     */
    clearExpired(config?: CacheConfig): void {
        const ttl = config?.ttl ?? this.defaultTTL;
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp >= ttl) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; pendingRequests: number } {
        return {
            size: this.cache.size,
            pendingRequests: this.pendingRequests.size,
        };
    }
}

// Singleton instance
export const apiCache = new ApiCache();

/**
 * Wrapper function to cache API calls with deduplication
 */
export async function cachedApiCall<T>(
    endpoint: string,
    apiCall: () => Promise<T>,
    options?: {
        cacheConfig?: CacheConfig;
        requestOptions?: RequestInit;
        skipCache?: boolean;
    }
): Promise<T> {
    const { cacheConfig, requestOptions, skipCache = false } = options || {};

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
        const cached = apiCache.get<T>(endpoint, requestOptions, cacheConfig);
        if (cached !== null) {
            return cached;
        }
    }

    // Check for pending request (deduplication)
    const pending = apiCache.getPendingRequest<T>(endpoint, requestOptions);
    if (pending) {
        return pending;
    }

    // Make new request
    const promise = apiCall();
    apiCache.setPendingRequest(endpoint, promise, requestOptions);

    try {
        const result = await promise;
        
        // Cache the result
        if (!skipCache) {
            apiCache.set(endpoint, result, requestOptions, cacheConfig);
        }
        
        return result;
    } catch (error) {
        // Don't cache errors
        throw error;
    }
}

