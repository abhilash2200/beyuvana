/**
 * Saved Addresses List Component
 * Displays list of saved addresses with primary address management
 */

import { Button } from "@/components/ui/button";
import { MapPin, Star, Check, Edit } from "lucide-react";
import type { SavedAddress } from "@/lib/api";

interface SavedAddressesListProps {
    addresses: SavedAddress[];
    loading: boolean;
    settingPrimary: number | null;
    onEdit: (address: SavedAddress) => void;
    onSetPrimary: (addressId: number) => void;
    isPrimaryAddress: (address: SavedAddress) => boolean;
    variant?: "desktop" | "mobile";
}

/**
 * Component to display list of saved addresses
 */
export function SavedAddressesList({
    addresses,
    loading,
    settingPrimary,
    onEdit,
    onSetPrimary,
    isPrimaryAddress,
    variant = "desktop",
}: SavedAddressesListProps) {
    if (loading) {
        return (
            <div className="text-center py-4">
                <div className={`animate-spin rounded-full ${variant === "mobile" ? "h-6 w-6" : "h-6 w-6"} border-b-2 border-green-600 mx-auto`}></div>
                <p className={`text-gray-500 mt-2 ${variant === "mobile" ? "text-xs" : "text-sm"}`}>Loading addresses...</p>
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className={`text-center ${variant === "mobile" ? "py-6" : "py-6"} text-gray-500`}>
                <MapPin className={`${variant === "mobile" ? "w-12 h-12" : "w-12 h-12"} mx-auto mb-2 text-gray-300`} />
                <p className={variant === "mobile" ? "text-xs" : "text-sm"}>No saved addresses yet</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${variant === "desktop" ? "max-h-90 overflow-y-auto" : ""}`}>
            {addresses.map((address) => (
                <div
                    key={address.id}
                    className={`${variant === "mobile"
                        ? "bg-[#F2F9F3] rounded-lg p-3 border"
                        : "bg-[#FAFAFA] rounded-[5px] p-2"} transition-all duration-200 ${isPrimaryAddress(address)
                            ? variant === "mobile"
                                ? "border-[#057A37] bg-green-50"
                                : "border-green-300 bg-green-50"
                            : variant === "mobile"
                                ? "border-gray-200"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${variant === "mobile" ? "text-sm" : "text-[13px]"} text-gray-800 capitalize`}>
                                {address.fullname}
                            </h4>
                            {isPrimaryAddress(address) && (
                                <span className={`inline-flex items-center gap-1 ${variant === "mobile"
                                    ? "text-[10px] font-light bg-[#057A37] text-white px-2 py-1 rounded-full"
                                    : "text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"}`}>
                                    <Star className="w-3 h-3 fill-current" />
                                    Selected
                                </span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant={variant === "mobile" ? "ghost" : "default"}
                                className={variant === "mobile"
                                    ? "h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    : "h-7 px-2 bg-transparent text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
                                onClick={() => onEdit(address)}
                            >
                                <Edit className="w-3 h-3" />
                            </Button>
                            {!isPrimaryAddress(address) && (
                                <Button
                                    variant={variant === "mobile" ? "ghost" : "default"}
                                    className={variant === "mobile"
                                        ? "h-6 w-6 p-0 text-[#057A37] hover:text-[#0C4B33] hover:bg-green-50"
                                        : "h-7 px-2 bg-transparent text-xs"}
                                    onClick={() => onSetPrimary(address.id)}
                                    disabled={settingPrimary === address.id}
                                >
                                    {settingPrimary === address.id ? (
                                        <div className={`animate-spin rounded-full ${variant === "mobile" ? "h-3 w-3" : "h-3 w-3"} border-b border-green-600`}></div>
                                    ) : (
                                        variant === "mobile" ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <>
                                                <Check className="w-3 h-3 mr-1" />
                                            </>
                                        )
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={`${variant === "mobile" ? "text-xs" : "text-[12px]"} text-gray-600 space-y-1`}>
                        <p className="capitalize">{address.address1}</p>
                        {address.address2 && (
                            <p className={`capitalize ${variant === "mobile" ? "" : "text-[#057A37]"}`}>
                                {variant === "mobile" ? "" : "📍 "}{address.address2}
                            </p>
                        )}
                        <p className="capitalize">{address.city}, {address.pincode}</p>
                        <div className={`flex gap-4 ${variant === "mobile" ? "text-xs" : "text-xs"} text-gray-500`}>
                            <span className="capitalize">{address.mobile}</span>
                            <span>{address.email}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

