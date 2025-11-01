"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    const storedUser = localStorage.getItem("user");
    const storedSession = localStorage.getItem("session_key");


    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to parse user from localStorage:", err);
        }
        localStorage.removeItem("user");
      }
    } else {
    }

    if (storedSession) {
      setSessionKey(storedSession);
    }
  }, []);

  useEffect(() => {
    try {
      if (user && sessionKey) {
        localStorage.setItem("session_key", sessionKey);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to persist session key:", err);
      }
    }
  }, [user, sessionKey]);

  const logout = async () => {

    try {
      if (sessionKey && user?.id) {
        const { authApi } = await import("@/lib/api");
        await authApi.logout(sessionKey, user.id);
      } else {
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Logout API error:", err);
        console.error("Logout API error details:", {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : null,
          hasSessionKey: !!sessionKey,
          hasUserId: !!user?.id
        });
      }
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("session_key");

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
