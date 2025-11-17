/**
 * Server-side Environment Variable Validation
 * Call this in server components or API routes
 */

import { validateAndLogEnvironment } from "./env-validation";

/**
 * Validates environment variables on the server side
 * Call this at the top of server components or API routes
 */
export function validateServerEnvironment(): void {
    // Always validate on server - throw errors in production
    const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    const result = validateAndLogEnvironment();

    if (!result.valid && !isDevelopment) {
        // In production, throw errors to prevent app from starting with invalid config
        throw new Error(
            `Server environment validation failed:\n${result.errors.join("\n")}\n\n` +
            "Please check your environment variables and try again."
        );
    }
}

