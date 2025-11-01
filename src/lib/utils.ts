import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create URL-safe slugs from product names
export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
}

/**
 * Adds a cache-busting query parameter to image URLs
 * Use this when you need to force browsers to fetch a fresh image after updating it
 * 
 * @param imagePath - The image path (e.g., "/assets/img/logo.png")
 * @param version - Optional version string or timestamp. If not provided, uses build time
 * @returns Image path with cache-busting query parameter
 * 
 * @example
 * // Automatic versioning
 * const imageUrl = getImageUrl("/assets/img/logo.png");
 * 
 * // Manual versioning
 * const imageUrl = getImageUrl("/assets/img/logo.png", "v2");
 */
export function getImageUrl(imagePath: string, version?: string): string {
  if (!imagePath) return imagePath;

  // If it's already an external URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Use provided version or generate one based on build time (in production)
  // In development, use current timestamp to always bust cache
  const cacheBuster = version || (
    process.env.NODE_ENV === "development"
      ? `t=${Date.now()}`
      : `v=${process.env.NEXT_PUBLIC_BUILD_ID || "1"}`
  );

  const separator = imagePath.includes("?") ? "&" : "?";
  return `${imagePath}${separator}cb=${cacheBuster}`;
}

/**
 * Formats a number as Indian Rupee currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "1,234.56")
 * @example
 * formatCurrency(1234.56) // Returns "1,234.56"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-IN");
}

/**
 * Formats a number as Indian Rupee currency with ₹ symbol
 * @param amount - The amount to format
 * @returns Formatted currency string with ₹ symbol (e.g., "₹1,234")
 * @example
 * formatINR(1234) // Returns "₹1,234"
 */
export function formatINR(amount: number): string {
  return `₹${formatCurrency(Math.round(amount))}`;
}
