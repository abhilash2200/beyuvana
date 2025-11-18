"use client";

/**
 * Skip link component for keyboard navigation accessibility
 * Allows users to skip to main content without tabbing through navigation
 */
export function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#057A37] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-[#057A37] focus:ring-offset-2"
            aria-label="Skip to main content"
        >
            Skip to main content
        </a>
    );
}

