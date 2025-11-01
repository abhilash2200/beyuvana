/**
 * Address Utilities
 * Helper functions for address management
 */

import type { SavedAddress } from "@/lib/api";

/**
 * Check if an address is the primary address
 */
export function isPrimaryAddress(address: SavedAddress): boolean {
    const isPrimary = address.is_primary;
    const primaryStr = String(isPrimary).toLowerCase();
    return isPrimary === 1 ||
        primaryStr === "1" ||
        primaryStr === "true" ||
        (typeof isPrimary === 'boolean' && isPrimary);
}

