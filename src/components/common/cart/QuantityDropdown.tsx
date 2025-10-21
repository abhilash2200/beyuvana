"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface QuantityDropdownProps {
    itemId: string;
    currentQuantity: number;
    loading: boolean;
}

export default function QuantityDropdown({ itemId, currentQuantity, loading }: QuantityDropdownProps) {
    const { increaseItemQuantity, decreaseItemQuantity, updateItemQuantity } = useCart();
    const [localQuantity, setLocalQuantity] = React.useState(currentQuantity);

    // Sync local quantity with prop changes
    React.useEffect(() => {
        setLocalQuantity(currentQuantity);
    }, [currentQuantity]);

    const handleIncrease = async () => {
        try {
            await increaseItemQuantity(itemId);
        } catch (error) {
            console.error("Failed to increase quantity:", error);
        }
    };

    const handleDecrease = async () => {
        try {
            await decreaseItemQuantity(itemId);
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
        }
    };

    const handleQuantityChange = async (newQuantity: number) => {
        const validQuantity = Math.max(1, Math.min(10, newQuantity)); // Limit between 1-10 for better UX
        setLocalQuantity(validQuantity);

        if (validQuantity !== currentQuantity) {
            try {
                await updateItemQuantity(itemId, validQuantity);
            } catch (error) {
                console.error("Failed to update quantity:", error);
                // Revert on error
                setLocalQuantity(currentQuantity);
            }
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 bg-white w-24 rounded-full border border-[#057A37] px-2 py-1">
            <Button
                variant="ghost"
                size="default"
                disabled={loading || localQuantity <= 1}
                className="text-[#057A37] text-[14px] px-1 h-6 w-6 p-0 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDecrease}
            >
                <Minus size={12} />
            </Button>

            <input
                type="number"
                min={1}
                max={10}
                value={localQuantity}
                onChange={(e) => {
                    const newQuantity = Number(e.target.value) || 1;
                    handleQuantityChange(newQuantity);
                }}
                onBlur={(e) => {
                    const newQuantity = Number(e.target.value) || 1;
                    handleQuantityChange(newQuantity);
                }}
                className="w-8 text-center outline-none text-[#057A37] bg-transparent text-[12px] font-medium"
                disabled={loading}
            />

            <Button
                variant="ghost"
                size="default"
                disabled={loading || localQuantity >= 10}
                className="text-[#057A37] text-[14px] px-1 h-6 w-6 p-0 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleIncrease}
            >
                <Plus size={12} />
            </Button>
        </div>
    );
}