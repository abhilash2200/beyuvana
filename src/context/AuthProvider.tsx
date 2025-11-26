"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { logger } from "@/lib/logger";

type User = { id: string; name: string; email: string; phone: string } | null;

interface AuthContextType {
  user: User;
  sessionKey: string | null;
  setUser: (u: User) => void;
  setSessionKey: (key: string | null) => void;
  logout: () => Promise<void>;
  isSessionValidating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isSessionValidating, setIsSessionValidating] = useState(false);
  const hasValidatedSession = useRef(false);

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const storedSession = localStorage.getItem("session_key");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        logger.warn("Failed to parse user from localStorage", err, "AuthProvider");
        localStorage.removeItem("user");
      }
    }

    if (storedSession) {
      setSessionKey(storedSession);
      // Log that session was loaded (without exposing the key)
      logger.debug("Session key loaded from storage", undefined, "AuthProvider");
    }
  }, []);

  // Validate session after restoring from localStorage
  useEffect(() => {
    // Only validate once, and only if we have both user and sessionKey
    if (hasValidatedSession.current || typeof window === "undefined") return;
    if (!user || !sessionKey) {
      hasValidatedSession.current = true;
      return;
    }

    const validateSession = async () => {
      setIsSessionValidating(true);
      try {
        // Use cart API to validate session - it's lightweight and handles 401 errors
        const { cartApi } = await import("@/lib/api/cart");
        const response = await cartApi.getCart(sessionKey, user.id);

        // Check if we got an authentication error (session expired)
        // getCart returns status: false with message "Please log in to sync your cart." for 401 errors
        if (response.status === false && (
          response.message?.includes("log in") || 
          response.message?.includes("401") ||
          response.message?.includes("authentication") ||
          response.message?.includes("unauthorized")
        )) {
          logger.info("Session expired or invalid, clearing auth state", undefined, "AuthProvider");
          // Clear localStorage and reset state
          localStorage.removeItem("user");
          localStorage.removeItem("session_key");
          setUser(null);
          setSessionKey(null);
        } else {
          // Session is valid (response succeeded or is a non-auth error)
          logger.debug("Session validated successfully", undefined, "AuthProvider");
        }
      } catch (error) {
        // Check if it's a 401 or authentication error
        if (error instanceof Error && (
          error.message.includes("401") || 
          error.message.includes("authentication") ||
          error.message.includes("unauthorized")
        )) {
          logger.info("Session expired (401/authentication error), clearing auth state", undefined, "AuthProvider");
          localStorage.removeItem("user");
          localStorage.removeItem("session_key");
          setUser(null);
          setSessionKey(null);
        } else {
          // For other errors (network, etc.), assume session might still be valid
          // Don't clear auth state on network errors - user might be offline
          logger.warn("Session validation error (non-auth), keeping auth state", error, "AuthProvider");
        }
      } finally {
        setIsSessionValidating(false);
        hasValidatedSession.current = true;
      }
    };

    validateSession();
  }, [user, sessionKey]);

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === "undefined") return;

    try {
      if (user && sessionKey) {
        localStorage.setItem("session_key", sessionKey);
      }
    } catch (err) {
      logger.warn("Failed to persist session key", err, "AuthProvider");
    }
  }, [user, sessionKey]);

  const logout = async () => {
    try {
      if (sessionKey && user?.id) {
        const { authApi } = await import("@/lib/api");
        await authApi.logout(sessionKey, user.id);
      }
    } catch (err) {
      logger.error("Logout API error", err, "AuthProvider");
    } finally {
      // Check if we're in the browser before accessing localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("session_key");
      }

      setUser(null);
      setSessionKey(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, sessionKey, setUser, setSessionKey, logout, isSessionValidating }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
