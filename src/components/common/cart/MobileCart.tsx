"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import CheckoutSheet from "./CheckoutSheet";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import { toast } from "react-toastify";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function MobileCart() {
    const {
        cartItems,
        loading,
        isCartOpen,
        setCartOpen,
        increaseItemQuantity,
        decreaseItemQuantity,
        updateItemQuantity,
        clearCart,
        removeFromCart
    } = useCart();
    const total = Math.round(cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0));
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
    const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);
    const [cartError, setCartError] = React.useState<string | null>(null);

    const handleSheetOpenChange = (open: boolean) => {
        setCartOpen(open);
    };

    const handleIncreaseQuantity = async (itemId: string) => {
        try {
            setCartError(null);
            await increaseItemQuantity(itemId);
        } catch (error) {
            console.error("Failed to increase quantity:", error);
            setCartError("Failed to update quantity. Please try again.");
        }
    };

    const handleDecreaseQuantity = async (itemId: string) => {
        try {
            setCartError(null);
            await decreaseItemQuantity(itemId);
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
            setCartError("Failed to update quantity. Please try again.");
        }
    };

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        try {
            setCartError(null);
            await updateItemQuantity(itemId, quantity);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            setCartError("Failed to update quantity. Please try again.");
        }
    };


    const handleClearCart = async () => {
        try {
            setCartError(null);
            await clearCart();
        } catch (error) {
            console.error("Failed to clear cart:", error);
            setCartError("Failed to clear cart. Please try again.");
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setCartError(null);
            console.log("🗑️ MobileCart - Removing item:", itemId);
            await removeFromCart(itemId);
            console.log("🗑️ MobileCart - Item removed successfully");
            // Toast is already handled in CartProvider.removeFromCart
        } catch (error) {
            console.error("Failed to remove item:", error);
            setCartError("Failed to remove item. Please try again.");
        }
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={handleSheetOpenChange}>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            className="relative"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-black" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#057A37] rounded-full" />
                            )}
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-800 text-white text-[12px] px-3 py-2 rounded-md shadow-xl border-0" sideOffset={8}>Open cart</TooltipContent>
            </Tooltip>
            <SheetContent
                side="bottom"
                aria-describedby={undefined}
                className="bg-white p-0 h-[85vh] flex flex-col relative gap-0 rounded-t-2xl"
                style={{
                    zIndex: 1002,
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
                <div className="shrink-0 border-b border-gray-200 bg-white rounded-t-2xl">
                    <SheetHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <SheetTitle className="text-[20px] font-normal text-[#057A37] font-[Grafiels]">
                                    Cart Details
                                </SheetTitle>
                                <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
                                <hr className="bg-[#057A37] w-20 h-0.5 mt-1" />
                            </div>
                            {/* {cartItems.length > 0 && (
                                <div className="flex gap-2">
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={handleClearCart}
                                                disabled={loading}
                                                variant="default"
                                                className="flex items-center gap-1 px-2 py-1 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            sideOffset={10}
                                            avoidCollisions={true}
                                            className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-xl border-0"
                                            style={{ zIndex: 99999 }}
                                        >
                                            Clear Cart
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            )} */}
                        </div>
                    </SheetHeader>

                    {cartItems.length > 0 && (
                        <div className="bg-[#122014] p-2 text-xs text-center mx-4 mb-2 rounded-lg">
                            <p className="text-white">
                                Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to{" "}
                                <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                            </p>
                        </div>
                    )}

                    {cartError && (
                        <div className="bg-red-50 border border-red-200 p-3 text-sm text-center mx-4 mb-2 rounded-lg">
                            <p className="text-red-600">
                                {cartError}
                            </p>
                            <button
                                onClick={() => setCartError(null)}
                                className="text-red-500 underline mt-1 text-xs"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>

                {
                    loading ? (
                        <div className="flex flex-1 justify-center items-center">
                            <div className="text-center text-gray-500 text-base">
                                <div className="animate-spin mx-auto mb-2 w-5 h-5 border-2 border-gray-300 border-t-[#057A37] rounded-full"></div>
                                Loading cart items...
                            </div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-1 justify-center items-center">
                            <p className="text-center text-gray-500 text-base">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                                {/* Mobile Cart Items */}
                                <div className="space-y-3">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${item.product_id || 'no-product'}-${index}`} className="bg-[#F2F9F3] rounded-xl p-3 border border-gray-100">
                                            <div className="flex gap-3">
                                                {/* Product Image */}
                                                <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    <Image
                                                        src={item.image || "/placeholder.png"}
                                                        alt={item.name || "Product image"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-[Grafiels] font-normal leading-tight text-[13px] line-clamp-2 flex-1 pr-2">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={loading}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    {/* Price and Discount */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="font-semibold text-[13px] text-[#057A37]">
                                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                        </p>
                                                        {item.mrp_price && item.discount_percent && (
                                                            <>
                                                                <span className="text-[10px] text-gray-400">|</span>
                                                                <p className="text-[10px] text-[#747474]">
                                                                    MRP ₹{(item.mrp_price * item.quantity).toLocaleString("en-IN")}
                                                                    <span className="text-[#057A37] ml-1">{item.discount_percent}% Off</span>
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-[10px] text-[#747474] line-clamp-1 mb-2">
                                                        {item.short_description || item.product_description || "Loading product details..."}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center justify-between gap-2 bg-white w-24 rounded-full border border-[#057A37] px-2 py-1">
                                                            <Button
                                                                variant="default"
                                                                disabled={loading}
                                                                className="text-[#057A37] text-[14px] px-1 h-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleDecreaseQuantity(item.id)}
                                                            >
                                                                <Minus size={12} />
                                                            </Button>

                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const newQuantity = Number(e.target.value) || 1;
                                                                    handleUpdateQuantity(item.id, newQuantity);
                                                                }}
                                                                className="w-8 text-center outline-none text-[#057A37] bg-transparent text-[12px]"
                                                            />

                                                            <Button
                                                                variant="default"
                                                                disabled={loading}
                                                                className="text-[#057A37] text-[14px] px-1 h-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleIncreaseQuantity(item.id)}
                                                            >
                                                                <Plus size={12} />
                                                            </Button>
                                                        </div>

                                                        <p className="text-[14px] font-semibold text-[#057A37]">
                                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Method Selection */}
                                <div className="mt-2">
                                    <h4 className="text-[14px] font-medium text-gray-800 mb-3">Payment Method</h4>
                                    <div className="flex gap-3 mb-3 w-[80%] mx-auto">
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-full border text-[12px] font-medium ${selectedPayment === "prepaid"
                                                ? "border-green-600 bg-green-100 text-green-700"
                                                : "border-gray-300 text-gray-600"
                                                }`}
                                            onClick={() => setSelectedPayment("prepaid")}
                                        >
                                            Prepaid
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-full border text-[12px] font-medium ${selectedPayment === "cod"
                                                ? "border-green-600 bg-green-100 text-green-700"
                                                : "border-gray-300 text-gray-600"
                                                }`}
                                            onClick={() => setSelectedPayment("cod")}
                                        >
                                            COD
                                        </button>
                                    </div>

                                    {selectedPayment === "prepaid" && (
                                        <div className="flex justify-center">
                                            <Image src="/assets/img/prepaid-image.png" alt="Prepaid" width={350} height={60} className="rounded-lg" />
                                        </div>
                                    )}
                                    {selectedPayment === "cod" && (
                                        <div className="flex justify-center">
                                            <Image src="/assets/img/postpaid-image.png" alt="COD" width={350} height={60} className="rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div className="mt-2">
                                    <DeliveryAddress
                                        key={addressRefreshKey}
                                        onAddAddress={() => setIsAddAddressOpen(true)}
                                    />
                                </div>
                            </div>

                            {/* Mobile Footer */}
                            <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
                                <div className="flex-1">
                                    <p className="text-lg font-bold">₹{total.toLocaleString("en-IN")}</p>
                                    {selectedPayment === "cod" && (
                                        <p className="text-[10px] text-gray-300">
                                            Delivery charges may apply on COD
                                        </p>
                                    )}
                                    {selectedPayment === "prepaid" && (
                                        <p className="text-[10px] text-gray-300">
                                            Free gifts added + upto ₹150 off
                                        </p>
                                    )}
                                    {!selectedPayment && (
                                        <p className="text-[10px] text-gray-300">
                                            Select a payment method to see offers
                                        </p>
                                    )}
                                </div>
                                <div className="bg-[#FFF] px-4 py-2 rounded-full ml-3">
                                    <CheckoutSheet
                                        trigger={
                                            <Button
                                                className="text-[#122014] font-medium text-[13px]"
                                                onClick={(e) => {
                                                    if (cartItems.length === 0) {
                                                        e.preventDefault();
                                                        toast.warning("Your cart is empty!");
                                                        return;
                                                    }
                                                    if (!selectedPayment) {
                                                        e.preventDefault();
                                                        toast.warning("Please select a payment method!");
                                                        return;
                                                    }
                                                }}
                                            >
                                                Proceed to pay
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                            <AddAddressSheet
                                open={isAddAddressOpen}
                                onOpenChange={setIsAddAddressOpen}
                                onAddressSaved={() => {
                                    setAddressRefreshKey(prev => prev + 1);
                                }}
                            />
                        </>
                    )
                }
            </SheetContent>
        </Sheet>
    );
}
