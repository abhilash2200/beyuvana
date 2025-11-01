import { PHONE_CONFIG } from "./constants";

/**
 * Validates a phone number according to Indian mobile number rules
 * @param phone - Phone number string
 * @returns Object with isValid flag and error message
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
    if (!phone) {
        return { isValid: false, error: "Phone number is required" };
    }

    // Basic phone validation - ensure it's exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return { isValid: false, error: "Please enter a valid 10-digit phone number." };
    }

    // Ensure phone number is exactly 10 digits for API
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== PHONE_CONFIG.LENGTH) {
        return { isValid: false, error: "Phone number must be exactly 10 digits." };
    }

    // Additional validation: Check if phone number starts with valid Indian mobile prefixes
    if (!PHONE_CONFIG.VALID_PREFIXES.includes(cleanPhone[0] as "6" | "7" | "8" | "9")) {
        return { isValid: false, error: "Please enter a valid Indian mobile number (starting with 6, 7, 8, or 9)." };
    }

    return { isValid: true };
}

/**
 * Validates an email address
 * @param email - Email string
 * @returns Object with isValid flag and error message
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
        return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Please enter a valid email address." };
    }

    return { isValid: true };
}

/**
 * Validates a required text field
 * @param value - Text value
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid flag and error message
 */
export function validateRequired(value: string, fieldName: string = "Field"): { isValid: boolean; error?: string } {
    if (!value || !value.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
}

/**
 * Validates text length
 * @param value - Text value
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid flag and error message
 */
export function validateLength(
    value: string,
    min?: number,
    max?: number,
    fieldName: string = "Field"
): { isValid: boolean; error?: string } {
    const length = value.trim().length;

    if (min !== undefined && length < min) {
        return { isValid: false, error: `${fieldName} must be at least ${min} characters long.` };
    }

    if (max !== undefined && length > max) {
        return { isValid: false, error: `${fieldName} must be no more than ${max} characters long.` };
    }

    return { isValid: true };
}

/**
 * Sanitizes text input to prevent XSS attacks
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeInput(text: string): string {
    return text.trim().replace(/[<>]/g, "");
}

/**
 * Validates a pincode (Indian postal code - 6 digits)
 * @param pincode - Pincode string
 * @returns Object with isValid flag and error message
 */
export function validatePincode(pincode: string): { isValid: boolean; error?: string } {
    if (!pincode) {
        return { isValid: false, error: "Pincode is required" };
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
        return { isValid: false, error: "Please enter a valid 6-digit pincode." };
    }

    return { isValid: true };
}

