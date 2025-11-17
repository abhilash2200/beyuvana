"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import QuantityDropdown from "./QuantityDropdown";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";
import { SavedAddress, promoApi } from "@/lib/api";
import { useCheckout } from "@/hooks/useCheckout";
import { calculateCartTotals } from "@/lib/cart-utils";
import { getPrepaidPromoCode, isPromoCodeEnabled } from "@/lib/promo-utils";

export default function MobileCart() {
    const {
        cartItems,
        loading,
        isCartOpen,
        setCartOpen,
        removeFromCart,
        clearCart
    } = useCart();
    const { user, sessionKey } = useAuth();
    const cartTotals = calculateCartTotals(cartItems);
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [selectedAddress, setSelectedAddress] = React.useState<SavedAddress | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
    const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);
    const [cartError, setCartError] = React.useState<string | null>(null);
    const [promoValue, setPromoValue] = React.useState<number>(0);
    const [promoCode, setPromoCode] = React.useState<string>("");

    const total = React.useMemo(() => {
        const baseTotal = cartTotals.total;
        if (selectedPayment === "prepaid" && promoValue > 0) {
            return Math.max(0, baseTotal - promoValue);
        }
        return baseTotal;
    }, [cartTotals.total, selectedPayment, promoValue]);

    const { processCheckout, isProcessingCheckout } = useCheckout({
        cartItems,
        user,
        sessionKey,
        clearCart,
        setCartError,
        promoCode: selectedPayment === "prepaid" ? promoCode : "",
        promoAmount: selectedPayment === "prepaid" ? promoValue : 0,
        discountedTotal: selectedPayment === "prepaid" && promoValue > 0 ? total : undefined,
    });

    const handleSheetOpenChange = (open: boolean) => {
        setCartOpen(open);
    };

    // Call API with updated price when prepaid is selected and promo is applied
    React.useEffect(() => {
        if (selectedPayment === "prepaid" && promoValue > 0 && promoCode && user?.id && sessionKey) {
            const updatePriceWithPromo = async () => {
                try {
                    const userId = typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id);
                    // Call promo API again with updated total to validate/update the price
                    await promoApi.getPromoDetails(
                        {
                            user_id: userId,
                            promo_code: promoCode,
                        },
                        sessionKey
                    );
                    // The API call validates the promo with the current cart total
                    // Backend will receive the updated price through the checkout API
                } catch (error) {
                    // Silently handle error - promo validation already happened in handlePrepaidClick
                    if (process.env.NODE_ENV === "development") {
                        console.error("Failed to update price with promo:", error);
                    }
                }
            };

            updatePriceWithPromo();
        }
    }, [selectedPayment, promoValue, promoCode, total, user?.id, sessionKey]);

    const handlePrepaidClick = async () => {
        setSelectedPayment("prepaid");

        if (user?.id && sessionKey) {
            // Get promo code from configuration
            const promoCodeValue = getPrepaidPromoCode();

            // If promo code is disabled or not configured, skip API call
            if (!isPromoCodeEnabled() || !promoCodeValue) {
                setPromoValue(0);
                setPromoCode("");
                if (typeof window !== "undefined") {
                    localStorage.removeItem("promo_code");
                }
                return;
            }

            try {
                const userId = typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id);
                const response = await promoApi.getPromoDetails(
                    {
                        user_id: userId,
                        promo_code: promoCodeValue,
                    },
                    sessionKey
                );

                // Type-safe promo value extraction
                const responseData = response.data;
                const promoValueFromResponse = (() => {
                    if (!responseData || typeof responseData !== "object") {
                        return 0;
                    }
                    const data = responseData as Record<string, unknown>;

                    // Try numeric values first
                    if (typeof data.promo_value === "number") {
                        return data.promo_value;
                    }
                    if (typeof data.promo_amount === "number") {
                        return data.promo_amount;
                    }
                    if (typeof data.discount_amount === "number") {
                        return data.discount_amount;
                    }

                    // Try string values
                    if (typeof data.promo_value === "string") {
                        const parsed = parseFloat(data.promo_value);
                        return isNaN(parsed) ? 0 : parsed;
                    }
                    if (typeof data.promo_amount === "string") {
                        const parsed = parseFloat(data.promo_amount);
                        return isNaN(parsed) ? 0 : parsed;
                    }
                    if (typeof data.discount_amount === "string") {
                        const parsed = parseFloat(data.discount_amount);
                        return isNaN(parsed) ? 0 : parsed;
                    }

                    return 0;
                })();

                setPromoValue(promoValueFromResponse);
                setPromoCode(promoCodeValue);

                // Store promo code in localStorage for payment response API
                if (typeof window !== "undefined") {
                    localStorage.setItem("promo_code", promoCodeValue);
                }
            } catch {
                // Reset promo value on error
                setPromoValue(0);
                setPromoCode("");
                // Clear promo code from localStorage on error
                if (typeof window !== "undefined") {
                    localStorage.removeItem("promo_code");
                }
                // Silently fail - don't block user from selecting prepaid
            }
        } else {
            // Reset promo value if user is not logged in
            setPromoValue(0);
            setPromoCode("");
            // Clear promo code from localStorage
            if (typeof window !== "undefined") {
                localStorage.removeItem("promo_code");
            }
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setCartError(null);
            await removeFromCart(itemId);
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to remove item:", error);
            }
            setCartError("Failed to remove item. Please try again.");
        }
    };

    const handleCheckout = async () => {
        if (!selectedPayment || !selectedAddress) {
            return;
        }
        await processCheckout(selectedPayment, selectedAddress);
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
                className="bg-white p-0 h-[85vh] flex flex-col relative gap-0 rounded-t-2xl [&>button]:hidden"
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
                            <Button
                                variant="ghost"
                                onClick={() => setCartOpen(false)}
                                className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700"
                            >
                                <X size={16} />
                            </Button>
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
                            <div className="flex-1 overflow-y-auto overflow-x-visible px-3 py-2 space-y-3">
                                {/* Mobile Cart Items */}
                                <div className="space-y-3">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${item.product_id || 'no-product'}-${index}`} className="bg-[#F2F9F3] rounded-xl p-3 border border-gray-100">
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center gap-2">
                                                    {/* Product Image */}
                                                    <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                        <Image
                                                            src={item.image || "/placeholder.png"}
                                                            alt={item.name || "Product image"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <QuantityDropdown
                                                            itemId={item.id}
                                                            currentQuantity={item.quantity}
                                                            loading={loading}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-[Grafiels] font-normal leading-tight text-[13px] line-clamp-2 flex-1 pr-2">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={loading}
                                                            className="p-1 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed z-10 rounded-full transition-colors duration-200 cursor-pointer border border-red-600 h-6 w-6"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="font-semibold text-[13px] text-[#057A37]">
                                                            {formatINR((item.price || 0) * item.quantity)}
                                                        </p>
                                                        {item.mrp_price && item.discount_percent && (
                                                            <>
                                                                <span className="text-[10px] text-gray-400">|</span>
                                                                <p className="text-[10px] text-[#747474]">
                                                                    MRP {formatINR(item.mrp_price * item.quantity)}
                                                                    <span className="text-[#057A37] ml-1">{item.discount_percent}% Off</span>
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>

                                                    <p className="text-[10px] text-[#747474] line-clamp-1 mb-2">
                                                        {item.short_description || item.product_description || "Loading product details..."}
                                                    </p>

                                                    <div className="flex items-center justify-end">
                                                        <p className="text-[14px] font-semibold text-[#057A37]">
                                                            {formatINR((item.price || 0) * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        // </div>
                                    ))}
                                </div>

                                <div className="mt-2">
                                    <h4 className="text-[14px] font-medium text-gray-800 mb-3">Payment Method</h4>
                                    <div className="flex gap-3 mb-3 w-[80%] mx-auto">
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-full border text-[12px] font-medium ${selectedPayment === "prepaid"
                                                ? "border-green-600 bg-green-100 text-green-700"
                                                : "border-gray-300 text-gray-600"
                                                }`}
                                            onClick={handlePrepaidClick}
                                        >
                                            Prepaid
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-full border text-[12px] font-medium ${selectedPayment === "cod"
                                                ? "border-green-600 bg-green-100 text-green-700"
                                                : "border-gray-300 text-gray-600"
                                                }`}
                                            onClick={() => {
                                                setSelectedPayment("cod");
                                                setPromoValue(0);
                                                setPromoCode("");
                                                if (typeof window !== "undefined") {
                                                    localStorage.removeItem("promo_code");
                                                }
                                            }}
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

                                <div className="mt-2">
                                    <DeliveryAddress
                                        key={addressRefreshKey}
                                        onAddAddress={() => setIsAddAddressOpen(true)}
                                        onAddressSelect={setSelectedAddress}
                                    />
                                </div>
                            </div>

                            <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
                                <div className="flex-1">
                                    <p className="text-lg font-bold">{formatINR(total)}</p>
                                    {selectedPayment === "cod" && (
                                        <p className="text-[10px] text-gray-300">
                                            Delivery charges may apply on COD
                                        </p>
                                    )}
                                    {selectedPayment === "prepaid" && (
                                        <p className="text-[10px] text-gray-300">
                                            Free gifts added + ₹150 off
                                        </p>
                                    )}
                                    {!selectedPayment && (
                                        <p className="text-[10px] text-gray-300">
                                            Select a payment method to see offers
                                        </p>
                                    )}
                                </div>
                                <div className="bg-[#FFF] px-4 py-2 rounded-full ml-3">
                                    <Button
                                        className="text-[#122014] font-medium text-[13px]"
                                        onClick={handleCheckout}
                                        disabled={isProcessingCheckout || loading}
                                    >
                                        {isProcessingCheckout ? "Processing..." : "Proceed to pay"}
                                    </Button>
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
        </Sheet >
    );
}
