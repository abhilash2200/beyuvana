"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { addressApi, SaveAddressRequest, SavedAddress } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { MapPin, Star, Check, Edit } from "lucide-react";

interface AddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddressSaved?: () => void;
}

export default function AddAddressSheet({ open, onOpenChange, onAddressSaved }: AddAddressSheetProps) {
    const { user, sessionKey } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [settingPrimary, setSettingPrimary] = useState<number | null>(null);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Helper function to check if an address is primary (same as DeliveryAddress)
    const isPrimaryAddress = (address: SavedAddress): boolean => {
        const isPrimary = address.is_primary;
        const primaryStr = String(isPrimary).toLowerCase();
        return isPrimary === 1 ||
            primaryStr === "1" ||
            primaryStr === "true" ||
            (typeof isPrimary === 'boolean' && isPrimary);
    };

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        pincode: "",
        landmark: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    // Fetch saved addresses when sheet opens
    const fetchSavedAddresses = useCallback(async () => {
        if (!user?.id || !sessionKey) return;

        try {
            setLoadingAddresses(true);
            const response = await addressApi.getAddresses(parseInt(user.id), sessionKey);

            if (response.data && Array.isArray(response.data)) {
                setSavedAddresses(response.data);
            } else {
                setSavedAddresses([]);
            }
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
            setSavedAddresses([]);
        } finally {
            setLoadingAddresses(false);
        }
    }, [user?.id, sessionKey]);

    // Set primary address
    const handleSetPrimary = async (addressId: number) => {
        if (!user?.id || !sessionKey) return;

        try {
            setSettingPrimary(addressId);
            // Debug: Setting primary address

            const response = await addressApi.setPrimaryAddress(parseInt(user.id), addressId, sessionKey);

            // Debug: Set primary address response

            if (response.success !== false) {
                // Debug: Primary address set successfully, updating local state and refreshing parent

                // Update local state to reflect the change
                setSavedAddresses(prev =>
                    prev.map(addr => ({
                        ...addr,
                        is_primary: addr.id === addressId ? 1 : 0
                    }))
                );

                // Clear any existing errors and show success message
                setError(null);
                setSuccessMessage("Primary address updated successfully!");

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);

                // Call callback to refresh parent component (DeliveryAddress)
                onAddressSaved?.();
            } else {
                console.error("Failed to set primary address:", response);
                setError(response.message || "Failed to set primary address");
            }
        } catch (err) {
            console.error("Failed to set primary address:", err);
            setError("Failed to set primary address. Please try again.");
        } finally {
            setSettingPrimary(null);
        }
    };


    // Edit address - populate form with address data
    const handleEditAddress = (address: SavedAddress) => {
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
            landmark: "", // Landmark field doesn't exist in SavedAddress interface
        });
        setError(null);
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditingAddress(null);
        setIsEditMode(false);
        setForm({
            fullName: "",
            email: "",
            phone: "",
            address1: "",
            address2: "",
            city: "",
            pincode: "",
            landmark: "",
        });
        setError(null);
    };

    // Load addresses when sheet opens
    useEffect(() => {
        if (open && user?.id && sessionKey) {
            fetchSavedAddresses();
        }
    }, [open, user?.id, sessionKey, fetchSavedAddresses]);

    // Reset edit mode when sheet closes
    useEffect(() => {
        if (!open) {
            setIsEditMode(false);
            setEditingAddress(null);
            setForm({
                fullName: "",
                email: "",
                phone: "",
                address1: "",
                address2: "",
                city: "",
                pincode: "",
                landmark: "",
            });
            setError(null);
            setSuccessMessage(null);
        }
    }, [open]);

    const handleSave = async () => {
        // Validate required fields
        if (!form.fullName || !form.email || !form.phone || !form.address1 || !form.city || !form.pincode) {
            setError("Please fill in all required fields");
            return;
        }

        if (!user?.id) {
            setError("Please login to save address");
            return;
        }

        if (!sessionKey) {
            setError("Session expired. Please login again");
            return;
        }

        // Check address limit (maximum 3 addresses) - only for new addresses
        if (!isEditMode && savedAddresses.length >= 3) {
            setError("You can save a maximum of 3 addresses. Please delete an existing address first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const addressData: SaveAddressRequest = {
                user_id: parseInt(user.id),
                fullname: form.fullName.trim(),
                address1: form.address1.trim(),
                address2: form.address2.trim() || "", // Send empty string if field is empty
                mobile: form.phone.trim(),
                email: form.email.trim(),
                city: form.city.trim(),
                pincode: form.pincode.trim(),
                is_primary: isEditMode ? editingAddress?.is_primary || 0 : 1, // Keep existing primary status when editing
            };

            // Debug: Saving/Updating address with data

            let response;
            if (isEditMode && editingAddress) {
                // Update existing address
                const updateData = { ...addressData, id: editingAddress.id };
                response = await addressApi.updateAddress(updateData, sessionKey);
            } else {
                // Create new address
                response = await addressApi.saveAddress(addressData, sessionKey);
            }

            // Debug: Address save response

            if (response.success !== false) {
                // Debug: Address saved/updated successfully
                // Reset form and edit mode
                setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    city: "",
                    pincode: "",
                    landmark: "",
                });
                setEditingAddress(null);
                setIsEditMode(false);
                // Refresh the saved addresses list
                await fetchSavedAddresses();
                // Call the callback to refresh addresses list in parent
                onAddressSaved?.();
            } else {
                // Handle specific error cases
                if (response.code === 401) {
                    setError("Authentication failed. Please login again.");
                } else {
                    setError(response.message || "Failed to save address");
                }
            }
        } catch (err) {
            console.error("Save address error:", err);
            if (err instanceof Error && err.message.includes("401")) {
                setError("Authentication failed. Please login again.");
            } else {
                setError(err instanceof Error ? err.message : "Failed to save address");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                aria-describedby={undefined}
                className="sm:max-w-md z-[1101] flex flex-col"
            >
                <SheetHeader>
                    <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                        {isEditMode ? "Edit Address" : "Add New Address"}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {isEditMode ? "Edit your address" : "Add your address"}
                    </SheetDescription>
                    <hr className="bg-[#057A37] w-28 h-0.5" />
                </SheetHeader>

                {/* Form fields */}
                <div className="p-4 space-y-3 overflow-y-auto">
                    {!user?.id && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                            <p className="font-medium">Login Required</p>
                            <p className="text-sm">Please login to save your address.</p>
                        </div>
                    )}
                    {!sessionKey && user?.id && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            <p className="font-medium">Session Expired</p>
                            <p className="text-sm">Please login again to save your address.</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {successMessage}
                        </div>
                    )}
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address1"
                        placeholder="Address Line 1"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.address1}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address2"
                        placeholder="Address Line 2"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.address2}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                            value={form.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        name="landmark"
                        placeholder="Landmark"
                        className="w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none"
                        value={form.landmark}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Saved Addresses Section */}
                {user?.id && sessionKey && (
                    <div className="p-4 border-t">
                        <h3 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Saved Addresses ({savedAddresses.length}/3)
                        </h3>

                        {loadingAddresses ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                                <p className="text-sm text-gray-500 mt-2">Loading addresses...</p>
                            </div>
                        ) : savedAddresses.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No saved addresses yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-90 overflow-y-auto">
                                {savedAddresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`bg-[#FAFAFA] rounded-[5px] p-2 transition-all duration-200 ${isPrimaryAddress(address)
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-[13px] text-gray-800 capitalize">
                                                    {address.fullname}
                                                </h4>
                                                {isPrimaryAddress(address) && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="default"
                                                    className="h-7 px-2 bg-transparent text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEditAddress(address)}
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                {!isPrimaryAddress(address) && (
                                                    <Button
                                                        variant="default"
                                                        className="h-7 px-2 bg-transparent text-xs"
                                                        onClick={() => handleSetPrimary(address.id)}
                                                        disabled={settingPrimary === address.id}
                                                    >
                                                        {settingPrimary === address.id ? (
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
                                                        ) : (
                                                            <>
                                                                <Check className="w-3 h-3 mr-1" />

                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-[12px] text-gray-600 space-y-1">
                                            <p className="capitalize">{address.address1}{address.address2 && `, ${address.address2}`}</p>
                                            <p className="capitalize">{address.city}, {address.pincode}</p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span className="capitalize">{address.mobile}</span>
                                                <span>{address.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t mt-auto">
                    <div className="flex gap-2">
                        {isEditMode && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            className={isEditMode ? "flex-1" : "w-full"}
                            onClick={handleSave}
                            disabled={loading || !user?.id || !sessionKey || (!isEditMode && savedAddresses.length >= 3)}
                        >
                            {loading ? (isEditMode ? "Updating..." : "Saving...") :
                                !user?.id ? "Login Required" :
                                    !sessionKey ? "Session Expired" :
                                        !isEditMode && savedAddresses.length >= 3 ? "Maximum 3 Addresses" :
                                            isEditMode ? "Update Address" : "Save Address"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
