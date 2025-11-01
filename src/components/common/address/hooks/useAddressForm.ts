/**
 * Address Form Hook
 * Manages address form state and validation
 */

import { useState } from "react";
import { validateRequired, validateEmail, validatePhone, validatePincode } from "@/lib/validation";
import type { SavedAddress } from "@/lib/api";

export interface AddressFormData {
    fullName: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    pincode: string;
}

const initialFormData: AddressFormData = {
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
};

/**
 * Hook to manage address form state and validation
 */
export function useAddressForm() {
    const [form, setForm] = useState<AddressFormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const resetForm = () => {
        setForm(initialFormData);
        setError(null);
        setIsEditMode(false);
        setEditingAddress(null);
    };

    const startEdit = (address: SavedAddress) => {
        setEditingAddress(address);
        setIsEditMode(true);
        setForm({
            fullName: address.fullname,
            email: address.email,
            phone: address.mobile,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            pincode: address.pincode,
        });
        setError(null);
    };

    const cancelEdit = () => {
        resetForm();
    };

    const validateForm = (): { isValid: boolean; error?: string } => {
        if (!validateRequired(form.fullName, "Name").isValid) {
            return { isValid: false, error: "Please enter your full name" };
        }

        const emailValidation = validateEmail(form.email);
        if (!emailValidation.isValid) {
            return { isValid: false, error: emailValidation.error || "Please enter a valid email address" };
        }

        const phoneValidation = validatePhone(form.phone);
        if (!phoneValidation.isValid) {
            return { isValid: false, error: phoneValidation.error || "Please enter a valid phone number" };
        }

        if (!validateRequired(form.address1, "Address").isValid) {
            return { isValid: false, error: "Please enter your address" };
        }

        if (!validateRequired(form.address2, "Landmark").isValid) {
            return { isValid: false, error: "Please enter a landmark" };
        }

        if (!validateRequired(form.city, "City").isValid) {
            return { isValid: false, error: "Please enter your city" };
        }

        const pincodeValidation = validatePincode(form.pincode);
        if (!pincodeValidation.isValid) {
            return { isValid: false, error: pincodeValidation.error || "Please enter a valid 6-digit pincode" };
        }

        return { isValid: true };
    };

    return {
        form,
        error,
        setError,
        isEditMode,
        editingAddress,
        handleChange,
        resetForm,
        startEdit,
        cancelEdit,
        validateForm,
    };
}

