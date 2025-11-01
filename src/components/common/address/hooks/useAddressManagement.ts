/**
 * Address Management Hook
 * Handles address CRUD operations and primary address management
 */

import { useState, useCallback } from "react";
import { addressApi, SaveAddressRequest, SavedAddress } from "@/lib/api";
import { toast } from "react-toastify";

interface UseAddressManagementParams {
    userId: string | number | null | undefined;
    sessionKey: string | null;
    savedAddresses: SavedAddress[];
    setSavedAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
    onAddressSaved?: () => void;
}

/**
 * Hook to manage address operations (save, update, set primary, fetch)
 */
export function useAddressManagement({
    userId,
    sessionKey,
    savedAddresses,
    setSavedAddresses,
    onAddressSaved,
}: UseAddressManagementParams) {
    const [loading, setLoading] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [settingPrimary, setSettingPrimary] = useState<number | null>(null);

    const fetchSavedAddresses = useCallback(async () => {
        if (!userId || !sessionKey) return;

        try {
            setLoadingAddresses(true);
            const response = await addressApi.getAddresses(parseInt(String(userId)), sessionKey);

            if (response.data && Array.isArray(response.data)) {
                const currentUserId = parseInt(String(userId));
                const userAddresses = response.data.filter(addr => {
                    const addrUserId = typeof addr.user_id === 'string' ? parseInt(addr.user_id) : addr.user_id;
                    return addrUserId === currentUserId;
                });
                setSavedAddresses(userAddresses);
            } else {
                setSavedAddresses([]);
            }
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to fetch addresses:", err);
            }
            setSavedAddresses([]);
        } finally {
            setLoadingAddresses(false);
        }
    }, [userId, sessionKey, setSavedAddresses]);

    const handleSetPrimary = useCallback(async (addressId: number) => {
        if (!userId || !sessionKey) return;

        try {
            setSettingPrimary(addressId);
            const response = await addressApi.setPrimaryAddress(parseInt(String(userId)), addressId, sessionKey);

            if (response.success !== false) {
                setSavedAddresses(prev =>
                    prev.map(addr => ({
                        ...addr,
                        is_primary: addr.id === addressId ? 1 : 0
                    }))
                );
                toast.success("Primary address updated successfully!");
                onAddressSaved?.();
            } else {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to set primary address:", response);
                }
                toast.error("Failed to set primary address. Please try again.");
            }
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to set primary address:", err);
            }
            toast.error("Failed to set primary address. Please try again.");
        } finally {
            setSettingPrimary(null);
        }
    }, [userId, sessionKey, setSavedAddresses, onAddressSaved]);

    const saveOrUpdateAddress = useCallback(async (
        formData: { fullName: string; email: string; phone: string; address1: string; address2: string; city: string; pincode: string },
        isEditMode: boolean,
        editingAddress: SavedAddress | null
    ): Promise<{ success: boolean; error?: string }> => {
        if (!userId || !sessionKey) {
            return { success: false, error: "Please login to save address" };
        }

        // Check address limit (maximum 3 addresses) - only for new addresses
        if (!isEditMode && savedAddresses.length >= 3) {
            return { success: false, error: "You can save a maximum of 3 addresses. Please delete an existing address first." };
        }

        setLoading(true);
        try {
            const addressData: SaveAddressRequest = {
                user_id: parseInt(String(userId)),
                fullname: formData.fullName.trim(),
                address1: formData.address1.trim(),
                address2: formData.address2.trim(),
                mobile: formData.phone.trim(),
                email: formData.email.trim(),
                city: formData.city.trim(),
                pincode: formData.pincode.trim(),
                is_primary: isEditMode ? editingAddress?.is_primary || 0 : 1,
            };

            let response;
            if (isEditMode && editingAddress) {
                const updateData = { ...addressData, id: editingAddress.id };
                response = await addressApi.updateAddress(updateData, sessionKey);
            } else {
                response = await addressApi.saveAddress(addressData, sessionKey);
            }

            if (response.success !== false) {
                const successMsg = isEditMode ? "Address updated successfully!" : "Address saved successfully!";
                toast.success(successMsg);
                await fetchSavedAddresses();
                onAddressSaved?.();
                return { success: true };
            } else {
                if (response.code === 401) {
                    return { success: false, error: "Authentication failed. Please login again." };
                }
                return { success: false, error: response.message || "Failed to save address" };
            }
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("Save address error:", err);
            }
            if (err instanceof Error && err.message.includes("401")) {
                return { success: false, error: "Authentication failed. Please login again." };
            }
            return { success: false, error: err instanceof Error ? err.message : "Failed to save address" };
        } finally {
            setLoading(false);
        }
    }, [userId, sessionKey, savedAddresses.length, fetchSavedAddresses, onAddressSaved]);

    return {
        loading,
        loadingAddresses,
        settingPrimary,
        fetchSavedAddresses,
        handleSetPrimary,
        saveOrUpdateAddress,
    };
}

