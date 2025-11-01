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
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";
import type { SavedAddress } from "@/lib/api";
import MobileAddAddressSheet from "./MobileAddAddressSheet";
import { useAddressForm } from "./hooks/useAddressForm";
import { useAddressManagement } from "./hooks/useAddressManagement";
import { AddressForm } from "./components/AddressForm";
import { SavedAddressesList } from "./components/SavedAddressesList";
import { isPrimaryAddress } from "./utils";

interface AddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddressSaved?: () => void;
}

export default function AddAddressSheet({ open, onOpenChange, onAddressSaved }: AddAddressSheetProps) {
    const { user, sessionKey } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Detect mobile viewport
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

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
            setSuccessMessage(null);
        }
    }, [open, resetForm]);

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
            setSuccessMessage(isEditMode ? "Address updated successfully!" : "Address saved successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.error || "Failed to save address");
            if (result.error && !result.error.includes("401")) {
                toast.error(result.error);
            }
        }
    };

    if (isMobile) {
        return <MobileAddAddressSheet open={open} onOpenChange={onOpenChange} onAddressSaved={onAddressSaved} />;
    }

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
                    <AddressForm form={form} onChange={handleChange} variant="desktop" />
                </div>

                {user?.id && sessionKey && (
                    <div className="p-4 border-t">
                        <h3 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Saved Addresses ({savedAddresses.length}/3)
                        </h3>
                        <SavedAddressesList
                            addresses={savedAddresses}
                            loading={loadingAddresses}
                            settingPrimary={settingPrimary}
                            onEdit={startEdit}
                            onSetPrimary={handleSetPrimary}
                            isPrimaryAddress={isPrimaryAddress}
                            variant="desktop"
                        />
                    </div>
                )}

                <div className="p-4 border-t mt-auto">
                    <div className="flex gap-2">
                        {isEditMode && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={cancelEdit}
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
