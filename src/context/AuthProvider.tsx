"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { logger } from "@/lib/logger";

type User = { id: string; name: string; email: string; phone: string } | null;

interface AuthContextType {
  user: User;
  sessionKey: string | null;
  setUser: (u: User) => void;
  setSessionKey: (key: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

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
    <AuthContext.Provider value={{ user, sessionKey, setUser, setSessionKey, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
