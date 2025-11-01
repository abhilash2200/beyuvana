// API Configuration
export const API_CONFIG = {
    TIMEOUT: 15000, // 15 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 1000, // 1 second base delay for exponential backoff
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504], // Status codes that should trigger retry
} as const;

// Cart Configuration
export const CART_CONFIG = {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 10,
    DEBOUNCE_DELAY: 500, // ms for quantity updates
    INPUT_DEBOUNCE_DELAY: 800, // ms for direct input changes
} as const;

// Phone Validation
export const PHONE_CONFIG = {
    LENGTH: 10,
    VALID_PREFIXES: ['6', '7', '8', '9'],
} as const;

// Environment Configuration
export const ENV_CONFIG = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://beyuvana.com/api",
    PROXY_URL: process.env.NEXT_PUBLIC_PROXY_URL || "/api/proxy",
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
    IMAGES_MAX_AGE: 604800, // 7 days
    ASSETS_MAX_AGE: 86400, // 1 day
    FONTS_MAX_AGE: 31536000, // 1 year
} as const;

// Color Constants (for consistency across the app)
export const COLORS = {
    PRIMARY: "#057A37",
    PRIMARY_DARK: "#04662a",
    PRIMARY_LIGHT: "#A9B528",
    SECONDARY: "#1A2819",
    TEXT_PRIMARY: "#1A2819",
    TEXT_SECONDARY: "#3B3B3B",
    TEXT_TERTIARY: "#555",
    BACKGROUND_LIGHT: "#F8F8F8",
    BACKGROUND_ACCENT: "#F2FFF7",
    BACKGROUND_WHITE: "#FFFFFF",
    BORDER: "#606060",
    BORDER_LIGHT: "#E5E5E5",
    SUCCESS: "#057A37",
    ERROR: "#EF4444",
    WARNING: "#F59E0B",
    GOLD: "#DFC362",
} as const;

