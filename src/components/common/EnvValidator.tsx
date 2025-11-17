/**
 * Environment Variable Validator Component
 * Validates environment variables on client-side mount
 * Only runs in development mode to avoid production overhead
 */

"use client";

import { useEffect } from "react";
import { validateAndLogEnvironment } from "@/lib/env-validation";

export function EnvValidator() {
    useEffect(() => {
        // Only validate in development
        if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
            validateAndLogEnvironment();
        }
    }, []);

    // This component doesn't render anything
    return null;
}

