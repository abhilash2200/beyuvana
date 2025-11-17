"use client";

import React from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";
import { CartItem } from "./CartItem";
import type { LocalCartItem } from "@/context/cart/types";

interface CartItemsListProps {
    items: LocalCartItem[];
    loading: boolean;
    onRemove: (itemId: string) => void;
    onIncreaseQuantity: (itemId: string) => void;
    onDecreaseQuantity: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    children?: React.ReactNode;
}

export function CartItemsList({
    items,
    loading,
    onRemove,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onUpdateQuantity,
    children,
}: CartItemsListProps) {
    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <div className="text-center text-gray-500 text-lg">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                    Loading cart items...
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-center text-gray-500 text-lg mb-2">Your cart is empty</p>
                    <p className="text-center text-gray-400 text-sm">Add some products to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <div className="flex flex-col gap-4 bg-[#F2F9F3] rounded-[10px] px-2 py-3">
                {items.map((item, index) => (
                    <CartItem
                        key={`${item.id}-${item.product_id || "no-product"}-${index}`}
                        item={item}
                        index={index}
                        loading={loading}
                        onRemove={onRemove}
                        onIncreaseQuantity={onIncreaseQuantity}
                        onDecreaseQuantity={onDecreaseQuantity}
                        onUpdateQuantity={onUpdateQuantity}
                    />
                ))}
            </div>
            {children}
        </div>
    );
}

