/**
 * Central handling for expired sessions (401).
 * API layer calls handleSessionExpired(); AuthProvider registers a handler
 * that clears auth state and redirects to login.
 */

const SESSION_EXPIRED_MESSAGE_KEY = "session_expired_message";

let sessionExpiredHandler: ((message?: string) => void) | null = null;

/**
 * Register the handler to run when a 401 (session expired) is received.
 * Should be called once by AuthProvider on mount.
 */
export function registerSessionExpiredHandler(
  handler: (message?: string) => void,
): void {
  sessionExpiredHandler = handler;
}

/**
 * Called from apiFetch when response status is 401.
 * Optionally pass the response body message (e.g. "Session expired. Please log in again.").
 * Stores message for the login page to show, then invokes the registered handler.
 */
export function handleSessionExpired(message?: string): void {
  if (typeof window !== "undefined") {
    const toShow =
      message && message.trim()
        ? message.trim()
        : "Session expired. Please log in again.";
    try {
      sessionStorage.setItem(SESSION_EXPIRED_MESSAGE_KEY, toShow);
    } catch {
      // ignore storage errors
    }
  }
  if (sessionExpiredHandler) {
    sessionExpiredHandler(message);
  }
}

/**
 * For the login/auth page: read and clear the session-expired message so it can be shown once.
 */
export function getAndClearSessionExpiredMessage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const msg = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);
    sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
    return msg;
  } catch {
    return null;
  }
}
