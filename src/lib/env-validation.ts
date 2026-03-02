/**
 * Environment Variable Validation
 * Validates all environment variables at startup and provides clear error messages
 */

import { logger } from "./logger";

interface EnvVarConfig {
  /** Variable name */
  name: string;
  /** Whether this variable is required */
  required: boolean;
  /** Default value if not set */
  defaultValue?: string;
  /** Description of what this variable is for */
  description: string;
  /** Validation function to check format/value */
  validator?: (value: string) => { valid: boolean; error?: string };
  /** Whether to show in production (some vars are dev-only) */
  showInProduction?: boolean;
}

/**
 * Validates URL format
 */
function validateUrl(value: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      return {
        valid: false,
        error: "URL must use http:// or https:// protocol",
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Validates that value is not empty
 */
function validateNotEmpty(value: string): { valid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: "Value cannot be empty" };
  }
  return { valid: true };
}

/**
 * Validates boolean-like string
 */
function validateBoolean(value: string): { valid: boolean; error?: string } {
  const lower = value.toLowerCase();
  if (!["true", "false", "1", "0", ""].includes(lower)) {
    return { valid: false, error: "Value must be 'true' or 'false'" };
  }
  return { valid: true };
}

/**
 * Environment variable configurations
 */
const ENV_VAR_CONFIGS: EnvVarConfig[] = [
  {
    name: "NEXT_PUBLIC_API_BASE_URL",
    required: false,
    defaultValue: "https://beyuvana.com/api",
    description: "Base URL for the API backend",
    validator: validateUrl,
  },
  {
    name: "NEXT_PUBLIC_PROXY_URL",
    required: false,
    defaultValue: "/proxy",
    description:
      "Proxy URL for API requests (used when API_BASE_URL is not set)",
    validator: (value) => {
      if (!value.startsWith("/")) {
        return { valid: false, error: "Proxy URL must start with '/'" };
      }
      return { valid: true };
    },
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    required: false,
    defaultValue: "http://localhost:3000",
    description: "Base URL of the website (used for metadata and redirects)",
    validator: validateUrl,
  },
  {
    name: "NEXT_PUBLIC_PREPAID_PROMO_CODE",
    required: false,
    defaultValue: "TEST150",
    description: "Promo code to automatically apply for prepaid orders",
    validator: validateNotEmpty,
  },
  {
    name: "NEXT_PUBLIC_AUTO_APPLY_PROMO",
    required: false,
    defaultValue: "true",
    description: "Whether to automatically apply promo code (true/false)",
    validator: validateBoolean,
  },
  {
    name: "NEXT_PUBLIC_BUILD_ID",
    required: false,
    description: "Build ID for cache busting (optional)",
  },
  {
    name: "NODE_ENV",
    required: false,
    defaultValue: "development",
    description: "Node environment (development/production/test)",
    validator: (value) => {
      if (!["development", "production", "test"].includes(value)) {
        return {
          valid: false,
          error: "NODE_ENV must be 'development', 'production', or 'test'",
        };
      }
      return { valid: true };
    },
  },
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    required: { missing: string[]; present: string[] };
    optional: { missing: string[]; present: string[] };
  };
}

/**
 * Validates all environment variables
 * @param options Configuration options
 * @returns Validation result with errors and warnings
 */
export function validateEnvironmentVariables(
  options: {
    /** Whether to throw on validation errors */
    throwOnError?: boolean;
    /** Whether to show warnings for missing optional vars */
    showWarnings?: boolean;
  } = {},
): ValidationResult {
  const { throwOnError = false, showWarnings = false } = options;
  const errors: string[] = [];
  const warnings: string[] = [];
  const summary = {
    required: { missing: [] as string[], present: [] as string[] },
    optional: { missing: [] as string[], present: [] as string[] },
  };

  const isProduction = process.env.NODE_ENV === "production";

  for (const config of ENV_VAR_CONFIGS) {
    const value = process.env[config.name];
    const isSet = value !== undefined && value !== null && value !== "";

    // Track in summary
    if (config.required) {
      if (isSet) {
        summary.required.present.push(config.name);
      } else {
        summary.required.missing.push(config.name);
      }
    } else {
      if (isSet) {
        summary.optional.present.push(config.name);
      } else {
        summary.optional.missing.push(config.name);
      }
    }

    // Check required variables
    if (config.required && !isSet) {
      const error = `Required environment variable ${config.name} is missing. ${config.description}`;
      errors.push(error);
      continue;
    }

    // Skip validation if not set and not required
    if (!isSet) {
      if (showWarnings && config.defaultValue) {
        warnings.push(
          `Optional environment variable ${config.name} is not set. Using default: ${config.defaultValue}. ${config.description}`,
        );
      }
      continue;
    }

    // Run validator if provided
    if (config.validator) {
      const validation = config.validator(value);
      if (!validation.valid) {
        const error = `Environment variable ${config.name} has invalid value: ${validation.error}. Current value: "${value}". ${config.description}`;
        errors.push(error);
      }
    }

    // Check if variable should be shown in production
    if (isProduction && config.showInProduction === false && isSet) {
      warnings.push(
        `Environment variable ${config.name} is set but should not be used in production. ${config.description}`,
      );
    }
  }

  // Special validation: At least one API configuration must be set
  const hasApiBaseUrl = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasProxyUrl = !!process.env.NEXT_PUBLIC_PROXY_URL;
  if (!hasApiBaseUrl && !hasProxyUrl) {
    errors.push(
      "Either NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_PROXY_URL must be set. At least one API endpoint configuration is required.",
    );
  }

  const result: ValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
    summary,
  };

  if (throwOnError && errors.length > 0) {
    const errorMessage = [
      "Environment variable validation failed:",
      ...errors.map((e) => `  - ${e}`),
      "",
      "Please check your .env.local file or environment configuration.",
    ].join("\n");
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * Validates environment variables and logs results
 * Call this at app startup
 */
export function validateAndLogEnvironment(): ValidationResult {
  const isDevelopment =
    process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
  const result = validateEnvironmentVariables({
    throwOnError: !isDevelopment, // Only throw in production
    showWarnings: isDevelopment, // Show warnings in development
  });

  if (result.errors.length > 0) {
    logger.validationError("Environment Variable Validation Errors:");
    result.errors.forEach((error) => logger.validationError(`  ${error}`));
  }

  if (result.warnings.length > 0) {
    logger.validationWarn("Environment Variable Warnings:");
    result.warnings.forEach((warning) => logger.validationWarn(`  ${warning}`));
  }

  if (result.valid && result.warnings.length === 0) {
    logger.validationSuccess("Environment variables validated successfully");
  }

  return result;
}

/**
 * Gets a formatted summary of environment variables
 * Useful for debugging and documentation
 */
export function getEnvironmentSummary(): string {
  const result = validateEnvironmentVariables({ showWarnings: false });
  const lines: string[] = ["Environment Variables Summary:", ""];

  lines.push("Required Variables:");
  if (result.summary.required.present.length > 0) {
    result.summary.required.present.forEach((name) => {
      lines.push(`  ✅ ${name}`);
    });
  }
  if (result.summary.required.missing.length > 0) {
    result.summary.required.missing.forEach((name) => {
      lines.push(`  ❌ ${name} (MISSING)`);
    });
  }

  lines.push("");
  lines.push("Optional Variables:");
  if (result.summary.optional.present.length > 0) {
    result.summary.optional.present.forEach((name) => {
      lines.push(`  ✅ ${name}`);
    });
  }
  if (result.summary.optional.missing.length > 0) {
    result.summary.optional.missing.forEach((name) => {
      const config = ENV_VAR_CONFIGS.find((c) => c.name === name);
      const defaultValue = config?.defaultValue
        ? ` (default: ${config.defaultValue})`
        : "";
      lines.push(`  ⚪ ${name}${defaultValue}`);
    });
  }

  return lines.join("\n");
}
