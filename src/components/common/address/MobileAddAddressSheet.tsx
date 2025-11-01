"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthProvider";
import { MapPin, X } from "lucide-react";
import { toast } from "react-toastify";
import type { SavedAddress } from "@/lib/api";
import { useAddressForm } from "./hooks/useAddressForm";
import { useAddressManagement } from "./hooks/useAddressManagement";
import { AddressForm } from "./components/AddressForm";
import { SavedAddressesList } from "./components/SavedAddressesList";
import { isPrimaryAddress } from "./utils";

interface MobileAddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddressSaved?: () => void;
}

export default function MobileAddAddressSheet({ open, onOpenChange, onAddressSaved }: MobileAddAddressSheetProps) {
    const { user, sessionKey } = useAuth();
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);

    // Address form hook
    const {
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
    } = useAddressForm();

    // Address management hook
    const {
        loading,
        loadingAddresses,
        settingPrimary,
        fetchSavedAddresses,
        handleSetPrimary,
        saveOrUpdateAddress,
    } = useAddressManagement({
        userId: user?.id,
        sessionKey,
        savedAddresses,
        setSavedAddresses,
        onAddressSaved,
    });

    // Load addresses when sheet opens
    useEffect(() => {
        if (open && user?.id && sessionKey) {
            fetchSavedAddresses();
        }
    }, [open, user?.id, sessionKey, fetchSavedAddresses]);

    // Reset form when sheet closes
    useEffect(() => {
        if (!open) {
            resetForm();
            setShowSavedAddresses(false);
            setSuccessMessage(null);
        }
    }, [open, resetForm]);

    const handleEditAddress = (address: SavedAddress) => {
        startEdit(address);
        setShowSavedAddresses(false);
    };

    const handleSave = async () => {
        // Validate form
        const validation = validateForm();
        if (!validation.isValid) {
            setError(validation.error || "Please fill in all required fields");
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

        // Check address limit
        if (!isEditMode && savedAddresses.length >= 3) {
            setError("You can save a maximum of 3 addresses. Please delete an existing address first.");
            return;
        }

        // Save or update address
        const result = await saveOrUpdateAddress(form, isEditMode, editingAddress);

        if (result.success) {
            resetForm();
            setShowSavedAddresses(false);
            setSuccessMessage(isEditMode ? "Address updated successfully!" : "Address saved successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.error || "Failed to save address");
            if (result.error && !result.error.includes("401")) {
                toast.error(result.error);
            }
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

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
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

                    <AddressForm form={form} onChange={handleChange} variant="mobile" />

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
                                    <SavedAddressesList
                                        addresses={savedAddresses}
                                        loading={loadingAddresses}
                                        settingPrimary={settingPrimary}
                                        onEdit={handleEditAddress}
                                        onSetPrimary={handleSetPrimary}
                                        isPrimaryAddress={isPrimaryAddress}
                                        variant="mobile"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white border-t px-4 py-4 w-full flex gap-3 shrink-0">
                    {isEditMode && (
                        <Button
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={cancelEdit}
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
