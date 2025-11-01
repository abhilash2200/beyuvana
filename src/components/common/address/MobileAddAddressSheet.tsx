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
import { MapPin, Star, Check, Edit, X } from "lucide-react";
import { toast } from "react-toastify";
import { validateRequired, validateEmail, validatePhone, validatePincode } from "@/lib/validation";

interface MobileAddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddressSaved?: () => void;
}

export default function MobileAddAddressSheet({ open, onOpenChange, onAddressSaved }: MobileAddAddressSheetProps) {
    const { user, sessionKey } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [settingPrimary, setSettingPrimary] = useState<number | null>(null);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);

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
            const response = await addressApi.setPrimaryAddress(parseInt(user.id), addressId, sessionKey);

            if (response.success !== false) {
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
                toast.success("Primary address updated successfully!");

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);

                // Call callback to refresh parent component (DeliveryAddress)
                onAddressSaved?.();
            } else {
                console.error("Failed to set primary address:", response);
                setError(response.message || "Failed to set primary address");
                toast.error("Failed to set primary address. Please try again.");
            }
        } catch (err) {
            console.error("Failed to set primary address:", err);
            setError("Failed to set primary address. Please try again.");
            toast.error("Failed to set primary address. Please try again.");
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
            address2: address.address2, // address2 contains landmark data
            city: address.city,
            pincode: address.pincode,
        });
        setError(null);
        setShowSavedAddresses(false);
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
            setShowSavedAddresses(false);
            setForm({
                fullName: "",
                email: "",
                phone: "",
                address1: "",
                address2: "",
                city: "",
                pincode: "",
            });
            setError(null);
            setSuccessMessage(null);
        }
    }, [open]);

    const handleSave = async () => {
        // Validate all fields using centralized validation
        if (!validateRequired(form.fullName, "Name").isValid) {
            setError("Please enter your full name");
            return;
        }

        const emailValidation = validateEmail(form.email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error || "Please enter a valid email address");
            return;
        }

        const phoneValidation = validatePhone(form.phone);
        if (!phoneValidation.isValid) {
            setError(phoneValidation.error || "Please enter a valid phone number");
            return;
        }

        if (!validateRequired(form.address1, "Address").isValid) {
            setError("Please enter your address");
            return;
        }

        if (!validateRequired(form.address2, "Landmark").isValid) {
            setError("Please enter a landmark");
            return;
        }

        if (!validateRequired(form.city, "City").isValid) {
            setError("Please enter your city");
            return;
        }

        const pincodeValidation = validatePincode(form.pincode);
        if (!pincodeValidation.isValid) {
            setError(pincodeValidation.error || "Please enter a valid 6-digit pincode");
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
                address2: form.address2.trim(), // Using address2 field as landmark
                mobile: form.phone.trim(),
                email: form.email.trim(),
                city: form.city.trim(),
                pincode: form.pincode.trim(),
                is_primary: isEditMode ? editingAddress?.is_primary || 0 : 1, // Keep existing primary status when editing
            };

            let response;
            if (isEditMode && editingAddress) {
                // Update existing address
                const updateData = { ...addressData, id: editingAddress.id };
                response = await addressApi.updateAddress(updateData, sessionKey);
            } else {
                // Create new address
                response = await addressApi.saveAddress(addressData, sessionKey);
            }

            if (response.success !== false) {
                const successMsg = isEditMode ? "Address updated successfully!" : "Address saved successfully!";
                toast.success(successMsg);
                // Reset form and edit mode
                setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    city: "",
                    pincode: "",
                });
                setEditingAddress(null);
                setIsEditMode(false);
                setShowSavedAddresses(false);
                // Refresh the saved addresses list
                await fetchSavedAddresses();
                // Call the callback to refresh addresses list in parent
                onAddressSaved?.();
            } else {
                // Handle specific error cases
                if (response.code === 401) {
                    setError("Authentication failed. Please login again.");
                    toast.error("Authentication failed. Please login again.");
                } else {
                    setError(response.message || "Failed to save address");
                    toast.error("Failed to save address. Please try again.");
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV === "development") {
                console.error("Save address error:", err);
            }
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
                side="bottom"
                aria-describedby={undefined}
                className="bg-white p-0 h-[90vh] flex flex-col relative gap-0 rounded-t-2xl"
                style={{
                    zIndex: 1101,
                    width: '100vw',
                    maxWidth: '100vw',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    position: 'fixed',
                    overflow: 'visible'
                }}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
            >
                {/* Mobile Header */}
                <div className="shrink-0 border-b border-gray-200 bg-white rounded-t-2xl relative z-10">
                    <SheetHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <SheetTitle className="text-[18px] font-normal text-[#057A37] font-[Grafiels]">
                                    {isEditMode ? "Edit Address" : "Add New Address"}
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    {isEditMode ? "Edit your address" : "Add your address"}
                                </SheetDescription>
                                <hr className="bg-[#057A37] w-16 h-0.5 mt-1" />
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </SheetHeader>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {/* Status Messages */}
                    {!user?.id && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-sm">
                            <p className="font-medium">Login Required</p>
                            <p className="text-xs">Please login to save your address.</p>
                        </div>
                    )}
                    {!sessionKey && user?.id && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                            <p className="font-medium">Session Expired</p>
                            <p className="text-xs">Please login again to save your address.</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-3">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="address1"
                            placeholder="Address Line 1"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
                            value={form.address1}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="address2"
                            placeholder="Landmark"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
                            value={form.address2}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex gap-3">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                className="flex-1 border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37] !w-42"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                className="flex-1 border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37] !w-42"
                                value={form.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Saved Addresses Toggle */}
                    {user?.id && sessionKey && savedAddresses.length > 0 && (
                        <div className="bg-white rounded-[5px] border border-green-300">
                            <button
                                onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                                className="w-full p-3 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#057A37]" />
                                    <span className="text-sm font-medium text-gray-800">
                                        Saved Addresses ({savedAddresses.length}/3)
                                    </span>
                                </div>
                                <div className={`transform transition-transform ${showSavedAddresses ? 'rotate-180' : ''}`}>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {showSavedAddresses && (
                                <div className="px-3 pb-3 space-y-2">
                                    {loadingAddresses ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#057A37] mx-auto"></div>
                                            <p className="text-xs text-gray-500 mt-2">Loading addresses...</p>
                                        </div>
                                    ) : (
                                        savedAddresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className={`bg-[#F2F9F3] rounded-lg p-3 border transition-all duration-200 ${isPrimaryAddress(address)
                                                    ? 'border-[#057A37] bg-green-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-sm text-gray-800 capitalize">
                                                            {address.fullname}
                                                        </h4>
                                                        {isPrimaryAddress(address) && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-light bg-[#057A37] text-white px-2 py-1 rounded-full">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleEditAddress(address)}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        {!isPrimaryAddress(address) && (
                                                            <Button
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 text-[#057A37] hover:text-[#0C4B33] hover:bg-green-50"
                                                                onClick={() => handleSetPrimary(address.id)}
                                                                disabled={settingPrimary === address.id}
                                                            >
                                                                {settingPrimary === address.id ? (
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-[#057A37]"></div>
                                                                ) : (
                                                                    <Check className="w-3 h-3" />
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-600 space-y-1">
                                                    <p className="capitalize">{address.address1}</p>
                                                    {address.address2 && <p className="capitalize">{address.address2}</p>}
                                                    <p className="capitalize">{address.city}, {address.pincode}</p>
                                                    <div className="flex gap-4 text-xs text-gray-500">
                                                        <span className="capitalize">{address.mobile}</span>
                                                        <span>{address.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Footer */}
                <div className="bg-white border-t px-4 py-4 w-full flex gap-3 shrink-0">
                    {isEditMode && (
                        <Button
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={handleCancelEdit}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        className={`${isEditMode ? 'flex-1' : 'w-full'} bg-[#057A37] py-2 font-normal hover:bg-[#0C4B33] text-white`}
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
            </SheetContent>
        </Sheet>
    );
}
