/**
 * Centralized Error Handling System
 * Provides consistent error handling, logging, and user feedback
 */

import { logger } from "./logger";
import { notifications } from "./notifications";

/**
 * Error categories for better error handling
 */
export enum ErrorCategory {
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  VALIDATION = "validation",
  API = "api",
  PERMISSION = "permission",
  NOT_FOUND = "not_found",
  SERVER = "server",
  CLIENT = "client",
  UNKNOWN = "unknown",
}

/**
 * Standardized error interface
 */
export interface AppError {
  message: string;
  category: ErrorCategory;
  originalError?: unknown;
  statusCode?: number;
  userMessage?: string;
  context?: string;
  retryable?: boolean;
}

/**
 * Extracts error information from various error types
 */
export function extractErrorInfo(error: unknown): AppError {
  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;
    let category = ErrorCategory.UNKNOWN;
    let statusCode: number | undefined;
    let retryable = false;

    // Check for API errors
    if (message.includes("API error:")) {
      category = ErrorCategory.API;
      const statusMatch = message.match(/API error: (\d+)/);
      if (statusMatch) {
        statusCode = parseInt(statusMatch[1], 10);
        if (statusCode >= 500) {
          category = ErrorCategory.SERVER;
          retryable = true;
        } else if (statusCode === 401 || statusCode === 403) {
          category = ErrorCategory.AUTHENTICATION;
        } else if (statusCode === 404) {
          category = ErrorCategory.NOT_FOUND;
        }
      }
    } else if (
      message.includes("network") ||
      message.includes("connection") ||
      message.includes("fetch")
    ) {
      category = ErrorCategory.NETWORK;
      retryable = true;
    } else if (message.includes("timeout")) {
      category = ErrorCategory.NETWORK;
      retryable = true;
    } else if (
      message.includes("unauthorized") ||
      message.includes("authentication")
    ) {
      category = ErrorCategory.AUTHENTICATION;
    } else if (message.includes("validation") || message.includes("invalid")) {
      category = ErrorCategory.VALIDATION;
    }

    return {
      message,
      category,
      originalError: error,
      statusCode,
      retryable,
    };
  }

  // Handle objects with error-like structure
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;
    const message = String(
      errorObj.message || errorObj.error || "An unknown error occurred",
    );
    const statusCode =
      typeof errorObj.status === "number" ? errorObj.status : undefined;

    let category = ErrorCategory.UNKNOWN;
    if (statusCode) {
      if (statusCode >= 500) {
        category = ErrorCategory.SERVER;
      } else if (statusCode === 401 || statusCode === 403) {
        category = ErrorCategory.AUTHENTICATION;
      } else if (statusCode === 404) {
        category = ErrorCategory.NOT_FOUND;
      } else if (statusCode >= 400 && statusCode < 500) {
        category = ErrorCategory.CLIENT;
      }
    }

    return {
      message,
      category,
      originalError: error,
      statusCode,
      retryable: statusCode ? statusCode >= 500 : false,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      category: ErrorCategory.UNKNOWN,
      originalError: error,
    };
  }

  // Fallback for unknown error types
  return {
    message: "An unexpected error occurred",
    category: ErrorCategory.UNKNOWN,
    originalError: error,
  };
}

/**
 * Gets user-friendly error message based on error category
 */
export function getUserFriendlyMessage(
  error: AppError,
  customMessage?: string,
): string {
  if (customMessage) {
    return customMessage;
  }

  if (error.userMessage) {
    return error.userMessage;
  }

  switch (error.category) {
    case ErrorCategory.NETWORK:
      return "Connection error. Please check your internet connection and try again.";
    case ErrorCategory.AUTHENTICATION:
      return "Authentication failed. Please login again.";
    case ErrorCategory.VALIDATION:
      return (
        error.message || "Invalid input. Please check your data and try again."
      );
    case ErrorCategory.NOT_FOUND:
      return "The requested resource was not found.";
    case ErrorCategory.SERVER:
      return "Server error. Please try again later.";
    case ErrorCategory.PERMISSION:
      return "You don't have permission to perform this action.";
    case ErrorCategory.API:
      return error.message || "API request failed. Please try again.";
    case ErrorCategory.CLIENT:
      return error.message || "Invalid request. Please check your input.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

/**
 * Handles errors consistently with logging and user feedback
 */
export function handleError(
  error: unknown,
  options: {
    context?: string;
    userMessage?: string;
    showToast?: boolean;
    logLevel?: "debug" | "info" | "warn" | "error";
    silent?: boolean; // If true, don't show toast (but still log)
  } = {},
): AppError {
  const {
    context = "Unknown",
    userMessage,
    showToast = true,
    logLevel = "error",
    silent = false,
  } = options;

  const appError = extractErrorInfo(error);
  appError.context = context;
  appError.userMessage = userMessage || getUserFriendlyMessage(appError);

  // Log the error
  if (!silent) {
    logger[logLevel](
      `Error in ${context}`,
      appError.originalError || appError.message,
      context,
    );
  }

  // Show user-friendly notification
  if (showToast && !silent) {
    showErrorNotification(appError, userMessage);
  }

  return appError;
}

/**
 * Shows appropriate error notification based on error category
 */
function showErrorNotification(error: AppError, customMessage?: string): void {
  const message =
    customMessage || error.userMessage || getUserFriendlyMessage(error);

  switch (error.category) {
    case ErrorCategory.NETWORK:
      notifications.network.connectionError();
      break;
    case ErrorCategory.AUTHENTICATION:
      notifications.network.unauthorized();
      break;
    case ErrorCategory.SERVER:
      notifications.network.serverError();
      break;
    case ErrorCategory.VALIDATION:
      notifications.general.error(message);
      break;
    default:
      notifications.general.error(message);
      break;
  }
}

/**
 * Handles API errors specifically
 */
export function handleApiError(
  error: unknown,
  options: {
    context?: string;
    userMessage?: string;
    showToast?: boolean;
    silent?: boolean;
  } = {},
): AppError {
  return handleError(error, {
    ...options,
    context: options.context || "API",
  });
}

/**
 * Handles validation errors
 */
export function handleValidationError(
  errors: Record<string, string> | string,
  options: {
    context?: string;
    showToast?: boolean;
  } = {},
): void {
  const { context = "Validation", showToast = true } = options;

  if (typeof errors === "string") {
    logger.warn(`Validation error in ${context}`, errors, context);
    if (showToast) {
      notifications.general.error(errors);
    }
  } else {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      logger.warn(`Validation error in ${context}`, errors, context);
      if (showToast) {
        notifications.general.error(firstError);
      }
    }
  }
}

/**
 * Creates a safe error handler for async operations
 */
export function createErrorHandler(context: string) {
  return (
    error: unknown,
    options?: { userMessage?: string; showToast?: boolean; silent?: boolean },
  ) => {
    return handleError(error, {
      context,
      ...options,
    });
  };
}

/**
 * Wraps an async function with consistent error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: {
    context?: string;
    userMessage?: string;
    showToast?: boolean;
    silent?: boolean;
    onError?: (error: AppError) => void;
  } = {},
): Promise<T | null> {
  const {
    context = "Unknown",
    userMessage,
    showToast = true,
    silent = false,
    onError,
  } = options;

  try {
    return await fn();
  } catch (error) {
    const appError = handleError(error, {
      context,
      userMessage,
      showToast,
      silent,
    });

    if (onError) {
      onError(appError);
    }

    return null;
  }
}

/**
 * Checks if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const appError = extractErrorInfo(error);
  return appError.retryable === true;
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const appError = extractErrorInfo(error);
  return appError.category === ErrorCategory.NETWORK;
}

/**
 * Checks if an error is an authentication error
 */
export function isAuthenticationError(error: unknown): boolean {
  const appError = extractErrorInfo(error);
  return appError.category === ErrorCategory.AUTHENTICATION;
}
