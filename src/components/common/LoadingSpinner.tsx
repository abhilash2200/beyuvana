"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  fullScreen = false,
  color = "#057A37",
}: LoadingSpinnerProps & { color?: string }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-b-2",
    md: "w-8 h-8 border-b-2",
    lg: "w-12 h-12 border-b-2",
    xl: "w-16 h-16 border-b-4",
  };

  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full mx-auto",
          sizeClasses[size] || sizeClasses.md
        )}
        style={{ borderColor: color, borderRightColor: "transparent", borderTopColor: "transparent", borderLeftColor: "transparent" }}
      ></div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
