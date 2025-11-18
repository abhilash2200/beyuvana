/**
 * Security Utilities
 * Frontend-focused security functions for input sanitization and XSS prevention
 * All functions are designed to work in browser environments
 */

import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify for comprehensive HTML sanitization
 * @param html - HTML string to sanitize
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(html: string, options?: Partial<DOMPurify.Config>): string {
    if (typeof window === "undefined") {
        // Server-side: Use a basic sanitization
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/javascript:/gi, "")
            .replace(/on\w+\s*=/gi, "");
    }

    // Client-side: Use DOMPurify for comprehensive sanitization
    const config = {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "span", "div", "ul", "ol", "li", "a"],
        ALLOWED_ATTR: ["href", "class", "style"],
        ALLOW_DATA_ATTR: false,
        ...options,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitized = DOMPurify.sanitize(html, config as any);
    return String(sanitized);
}

/**
 * Sanitizes text input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeTextInput(text: string): string {
    if (!text) return "";

    return text
        .trim()
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .replace(/script/gi, "");
}

/**
 * Validates and sanitizes URL to prevent XSS and SSRF
 * @param url - URL to validate
 * @param allowedDomains - Array of allowed domain names
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeURL(url: string, allowedDomains?: string[]): string | null {
    if (!url) return null;

    try {
        const urlObj = new URL(url);

        // Check if domain is allowed
        if (allowedDomains && allowedDomains.length > 0) {
            const isAllowed = allowedDomains.some(domain =>
                urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
            );
            if (!isAllowed) {
                return null;
            }
        }

        // Only allow http and https protocols
        if (!["http:", "https:"].includes(urlObj.protocol)) {
            return null;
        }

        return urlObj.toString();
    } catch {
        return null;
    }
}

/**
 * Sanitizes user input for display in HTML
 * Escapes HTML special characters
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
export function escapeHTML(text: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validates file upload to prevent malicious files
 * @param file - File object to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result
 */
export function validateFileUpload(
    file: File,
    allowedTypes: string[],
    maxSize: number
): { isValid: boolean; error?: string } {
    if (!file) {
        return { isValid: false, error: "No file provided" };
    }

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: `File type ${file.type} is not allowed` };
    }

    if (file.size > maxSize) {
        return { isValid: false, error: `File size exceeds maximum of ${maxSize} bytes` };
    }

    // Check for dangerous file extensions
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".scr", ".vbs", ".js", ".jar"];
    const fileName = file.name.toLowerCase();
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
        return { isValid: false, error: "File type is not allowed for security reasons" };
    }

    return { isValid: true };
}

