/**
 * Mode Logger Component
 * Logs the current mode (development or production) on app startup
 */

"use client";

import { useEffect } from "react";
import { ENV_CONFIG } from "@/lib/constants";

export function ModeLogger() {
  useEffect(() => {
    if (ENV_CONFIG.IS_PRODUCTION) {
      console.log("production mode");
    } else {
      console.log("development");
    }
  }, []);

  // This component doesn't render anything
  return null;
}
