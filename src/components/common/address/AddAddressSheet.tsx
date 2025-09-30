"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { addressApi, SaveAddressRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

interface AddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddressSaved?: () => void;
}

export default function AddAddressSheet({ open, onOpenChange, onAddressSaved }: AddAddressSheetProps) {
    const { user, sessionKey } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        setLoading(true);
        setError(null);

        try {
            const addressData: SaveAddressRequest = {
                user_id: parseInt(user.id),
                fullname: form.fullName,
                address1: form.address1,
                address2: form.address2,
                mobile: form.phone,
                email: form.email,
                city: form.city,
                pincode: form.pincode,
                is_primary: 1, // Set as primary address
            };

            console.log("Saving address with data:", {
                addressData,
                sessionKey: sessionKey ? "Present" : "Missing",
                userId: user.id
            });

            const response = await addressApi.saveAddress(addressData, sessionKey);

            console.log("Address save response:", response);

            if (response.success !== false) {
                console.log("Address saved successfully:", response);
                // Reset form
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
                onOpenChange(false);
                // Call the callback to refresh addresses list
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
                        Add New Address
                    </SheetTitle>
                    <SheetDescription className="sr-only">Add you address</SheetDescription>
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
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        className="w-full border rounded p-2"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        className="w-full border rounded p-2"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        className="w-full border rounded p-2"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address1"
                        placeholder="Address Line 1 *"
                        className="w-full border rounded p-2"
                        value={form.address1}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address2"
                        placeholder="Address Line 2"
                        className="w-full border rounded p-2"
                        value={form.address2}
                        onChange={handleChange}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="city"
                            placeholder="City *"
                            className="w-full border rounded p-2"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode *"
                            className="w-full border rounded p-2"
                            value={form.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        name="landmark"
                        placeholder="Landmark"
                        className="w-full border rounded p-2"
                        value={form.landmark}
                        onChange={handleChange}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t mt-auto">
                    <Button
                        className="w-full"
                        onClick={handleSave}
                        disabled={loading || !user?.id || !sessionKey}
                    >
                        {loading ? "Saving..." :
                            !user?.id ? "Login Required" :
                                !sessionKey ? "Session Expired" :
                                    "Save Address"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
