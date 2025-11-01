/**
 * Cart Types
 * Centralized type definitions for cart functionality
 */

import { ProductDetailsResponse } from "@/lib/api";

export type ServerCartItem = {
    id?: string;
    product_id: string;
    name?: string;
    product_name?: string;
    price_unit_name?: string;
    price?: number;
    sale_price?: string | number;
    final_price?: string | number;
    quantity?: number;
    qty?: string | number;
    image?: string;
    product_image?: string;
    mrp?: string | number;
    mrp_price?: number;
    discount_percent?: string;
    discount_off_inpercent?: string;
    short_description?: string;
    product_description?: string;
    in_stock?: string;
    cart_id?: string;
    unit_qty?: string | number;
    unit_name?: string;
    product_code?: string;
    sku_number?: string;
    posted_on?: string;
    discount_amount?: number;
};

export type LocalCartItem = {
    id: string;
    name: string;
    price?: number;
    quantity: number;
    image?: string;
    product_id?: string;
    pack_qty?: number;
    product_price_id?: string;
    product_details?: ProductDetailsResponse;
    mrp_price?: number;
    discount_percent?: string;
    short_description?: string;
    product_description?: string;
    in_stock?: string;
    cart_id?: string;
    unit_name?: string;
};

export type CartContextType = {
    cartItems: LocalCartItem[];
    addToCart: (item: LocalCartItem) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    increaseItemQuantity: (id: string) => Promise<void>;
    decreaseItemQuantity: (id: string) => Promise<void>;
    updateItemQuantity: (id: string, qty: number) => Promise<void>;
    syncWithServer: () => Promise<void>;
    refreshCart: () => Promise<void>;
    refreshProductDetails: () => Promise<void>;
    loading: boolean;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    setCartOpen: (open: boolean) => void;
};

