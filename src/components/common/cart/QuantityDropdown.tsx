"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus } from "lucide-react";
import { useCart } from "@/context/CartProvider";

interface QuantityDropdownProps {
    itemId: string;
    currentQuantity: number;
    loading: boolean;
}

export default function QuantityDropdown({ itemId, currentQuantity, loading }: QuantityDropdownProps) {
    const { updateItemQuantity } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customQuantity, setCustomQuantity] = useState(currentQuantity.toString());

    const handleQuantitySelect = (quantity: number) => {
        updateItemQuantity(itemId, quantity);
        setIsDropdownOpen(false);
    };

    const handleCustomQuantitySubmit = () => {
        const quantity = parseInt(customQuantity);
        if (quantity > 0) {
            updateItemQuantity(itemId, quantity);
            setIsDialogOpen(false);
            setIsDropdownOpen(false);
        }
    };

    const handleMoreClick = () => {
        setCustomQuantity(currentQuantity.toString());
        setIsDialogOpen(true);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative">
            {/* Dropdown Trigger */}
            <Button
                variant="outline"
                className="flex items-center justify-between w-16 rounded-[5px] h-7 px-2 py-1 text-[12px] border-[#057A37] text-[#057A37] hover:bg-[#F2F9F3]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loading}
            >
                <span className="font-medium">{currentQuantity}</span>
                <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-[#057A37] rounded-lg shadow-lg z-50">
                    <div className="py-1">
                        {[1, 2, 3].map((quantity) => (
                            <button
                                key={quantity}
                                className={`w-full px-3 py-2 text-left text-[12px] hover:bg-[#F2F9F3] transition-colors ${currentQuantity === quantity ? 'bg-[#F2F9F3] text-[#057A37] font-medium' : 'text-gray-700'
                                    }`}
                                onClick={() => handleQuantitySelect(quantity)}
                            >
                                {quantity}
                            </button>
                        ))}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                            className="w-full px-3 py-2 text-left text-[12px] text-[#057A37] hover:bg-[#F2F9F3] transition-colors flex items-center gap-2"
                            onClick={handleMoreClick}
                        >
                            <Plus size={12} />
                            Add more
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Quantity Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white border border-[#057A37]">
                    <DialogHeader>
                        <DialogTitle className="text-[#057A37] font-[Grafiels] text-lg font-normal">
                            Enter Quantity
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                How many would you like?
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={customQuantity}
                                onChange={(e) => setCustomQuantity(e.target.value)}
                                className="border-[#057A37] focus:border-[#057A37] focus:ring-[#057A37]"
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-red-500 text-red-500 hover:bg-[#F2F9F3] text-[12px] px-2 font-normal"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCustomQuantitySubmit}
                                className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-2 py-1 text-[12px] font-normal"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Overlay to close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
}
