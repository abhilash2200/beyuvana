/**
 * Logging Utility
 * Centralized logging system with environment-aware log levels
 * Replaces console statements throughout the codebase
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: unknown;
    timestamp: string;
    context?: string;
}

interface LoggerConfig {
    minLevel: LogLevel;
    enableInProduction: boolean;
    includeTimestamp: boolean;
    includeContext: boolean;
    customHandler?: (entry: LogEntry) => void;
}

const DEFAULT_CONFIG: LoggerConfig = {
    minLevel: "debug",
    enableInProduction: false,
    includeTimestamp: true,
    includeContext: true,
};

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private config: LoggerConfig;
    private isDevelopment: boolean;

    constructor(config: Partial<LoggerConfig> = {}) {
        this.isDevelopment =
            process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
        this.config = {
            ...DEFAULT_CONFIG,
            enableInProduction: config.enableInProduction ?? false,
            minLevel: config.minLevel ?? (this.isDevelopment ? "debug" : "error"),
            ...config,
        };
    }

    /**
     * Checks if a log level should be output
     */
    private shouldLog(level: LogLevel): boolean {
        // Don't log in production unless explicitly enabled
        if (!this.isDevelopment && !this.config.enableInProduction) {
            return false;
        }

        // Check if level meets minimum threshold
        return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
    }

    /**
     * Formats log entry for output
     */
    private formatEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
        return {
            level,
            message,
            data,
            timestamp: this.config.includeTimestamp
                ? new Date().toISOString()
                : "",
            context: this.config.includeContext ? context : undefined,
        };
    }

    /**
     * Outputs log entry (no-op - logging disabled)
     */
    private output(entry: LogEntry): void {
        if (this.config.customHandler) {
            this.config.customHandler(entry);
            return;
        }
        // Logging disabled - no console output
    }

    /**
     * Logs a debug message
     */
    debug(message: string, data?: unknown, context?: string): void {
        if (!this.shouldLog("debug")) return;
        this.output(this.formatEntry("debug", message, data, context));
    }

    /**
     * Logs an info message
     */
    info(message: string, data?: unknown, context?: string): void {
        if (!this.shouldLog("info")) return;
        this.output(this.formatEntry("info", message, data, context));
    }

    /**
     * Logs a warning message
     */
    warn(message: string, data?: unknown, context?: string): void {
        if (!this.shouldLog("warn")) return;
        this.output(this.formatEntry("warn", message, data, context));
    }

    /**
     * Logs an error message
     */
    error(message: string, error?: unknown, context?: string): void {
        if (!this.shouldLog("error")) return;

        // Format error object if provided
        let errorData: unknown = error;
        if (error instanceof Error) {
            errorData = {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
            };
        }

        this.output(this.formatEntry("error", message, errorData, context));
    }

    /**
     * Logs environment validation messages (special handling)
     */
    validationError(message: string): void {
        if (!this.shouldLog("error")) return;
        // Logging disabled
    }

    /**
     * Logs environment validation warnings (special handling)
     */
    validationWarn(message: string): void {
        if (!this.shouldLog("warn")) return;
        // Logging disabled
    }

    /**
     * Logs environment validation success (special handling)
     */
    validationSuccess(message: string): void {
        if (!this.shouldLog("info")) return;
        // Logging disabled
    }

    /**
     * Updates logger configuration
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }
}

// Create default logger instance
const defaultLogger = new Logger();

// Export logger instance and class
export const logger = defaultLogger;
export { Logger };
export type { LoggerConfig, LogLevel, LogEntry };

/**
 * Helper function to create a logger with context
 */
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
    const contextLogger = new Logger(config);
    return {
        ...contextLogger,
        debug: (message: string, data?: unknown) =>
            contextLogger.debug(message, data, context),
        info: (message: string, data?: unknown) =>
            contextLogger.info(message, data, context),
        warn: (message: string, data?: unknown) =>
            contextLogger.warn(message, data, context),
        error: (message: string, error?: unknown) =>
            contextLogger.error(message, error, context),
    } as Logger;
}

/**
 * Helper to sanitize sensitive data from logs
 */
export function sanitizeForLogging(data: unknown): unknown {
    if (typeof data !== "object" || data === null) {
        return data;
    }

    const sensitiveKeys = [
        "session_key",
        "sessionKey",
        "password",
        "token",
        "authorization",
        "auth",
        "secret",
        "api_key",
        "apikey",
    ];

    if (Array.isArray(data)) {
        return data.map(sanitizeForLogging);
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sk) => lowerKey.includes(sk.toLowerCase()))) {
            sanitized[key] = "[REDACTED]";
        } else if (typeof value === "object" && value !== null) {
            sanitized[key] = sanitizeForLogging(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

