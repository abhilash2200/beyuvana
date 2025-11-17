"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, RefreshCw, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import { toast } from "react-toastify";
import React from "react";
import Confetti from "react-confetti";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MobileCart from "./MobileCart";
import { ErrorBoundary } from "../ErrorBoundary";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";
import { SavedAddress, promoApi } from "@/lib/api";
import { useCheckout } from "@/hooks/useCheckout";
import { calculateCartTotals } from "@/lib/cart-utils";
import { getPrepaidPromoCode, isPromoCodeEnabled } from "@/lib/promo-utils";
import { handleError } from "@/lib/error-handling";

export default function Cart() {
    const { cartItems, increaseItemQuantity, decreaseItemQuantity, updateItemQuantity, refreshCart, clearCart, removeFromCart, loading, isCartOpen, setCartOpen } = useCart();
    const { user, sessionKey } = useAuth();
    const cartTotals = calculateCartTotals(cartItems);
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [selectedAddress, setSelectedAddress] = React.useState<SavedAddress | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [lastIncreaseTime, setLastIncreaseTime] = React.useState<number>(0);
    const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(false);
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

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleSheetOpenChange = (open: boolean) => {
        setCartOpen(open);
    };
    React.useEffect(() => {
        if (lastIncreaseTime > 0) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                toast.success("🎉 Great choice! Adding more to your cart!", {
                    position: "bottom-center",
                    autoClose: 2000,
                });
                setTimeout(() => setShowConfetti(false), 5000);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [lastIncreaseTime]);

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
                    handleError(error, {
                        context: "Cart",
                        silent: true, // Don't show toast or log (already validated)
                        logLevel: "debug",
                    });
                }
            };

            updatePriceWithPromo();
        }
    }, [selectedPayment, promoValue, promoCode, total, user?.id, sessionKey]);

    const handleIncreaseQuantity = async (itemId: string) => {
        try {
            setCartError(null);
            await increaseItemQuantity(itemId);
            setLastIncreaseTime(Date.now());
        } catch (error) {
            const appError = handleError(error, {
                context: "Cart",
                userMessage: "Failed to update quantity. Please try again.",
                showToast: false, // We show cartError instead
            });
            setCartError(appError.userMessage || "Failed to update quantity. Please try again.");
        }
    };

    const handleDecreaseQuantity = async (itemId: string) => {
        try {
            setCartError(null);
            await decreaseItemQuantity(itemId);
        } catch (error) {
            const appError = handleError(error, {
                context: "Cart",
                userMessage: "Failed to update quantity. Please try again.",
                showToast: false,
            });
            setCartError(appError.userMessage || "Failed to update quantity. Please try again.");
        }
    };

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        try {
            setCartError(null);
            await updateItemQuantity(itemId, quantity);
        } catch (error) {
            const appError = handleError(error, {
                context: "Cart",
                userMessage: "Failed to update quantity. Please try again.",
                showToast: false,
            });
            setCartError(appError.userMessage || "Failed to update quantity. Please try again.");
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setCartError(null);
            await removeFromCart(itemId);
            toast.success("Item removed from cart", {
                position: "bottom-center",
                autoClose: 2000,
            });
        } catch (error) {
            const appError = handleError(error, {
                context: "Cart",
                userMessage: "Failed to remove item. Please try again.",
                showToast: false,
            });
            setCartError(appError.userMessage || "Failed to remove item. Please try again.");
        }
    };

    const handleRefreshCart = async () => {
        try {
            setCartError(null);
            await refreshCart();
        } catch (error) {
            const appError = handleError(error, {
                context: "Cart",
                userMessage: "Failed to refresh cart. Please try again.",
                showToast: false,
            });
            setCartError(appError.userMessage || "Failed to refresh cart. Please try again.");
        }
    };


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

    const handleCheckout = async () => {
        if (!selectedPayment || !selectedAddress) {
            return;
        }
        await processCheckout(selectedPayment, selectedAddress);
    };

    if (isMobile) {
        return <MobileCart />;
    }

    return (
        <ErrorBoundary>
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
                    side="right"
                    aria-describedby={undefined}
                    className="bg-white p-0 h-screen flex flex-col relative gap-0"
                    style={{
                        zIndex: 1002,
                        width: '450px',
                        maxWidth: '90vw',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        position: 'fixed',
                        overflow: 'visible'
                    }}
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                            <Confetti
                                width={450}
                                height={window.innerHeight}
                                recycle={false}
                                numberOfPieces={150}
                                gravity={0.4}
                                initialVelocityY={20}
                                initialVelocityX={5}
                                colors={['#057A37', '#0C4B33', '#1A2819', '#FFD700', '#FF6B6B']}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        </div>
                    )}

                    <div className="shrink-0 border-b border-gray-200 bg-white">
                        <SheetHeader className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                                        Cart Details
                                    </SheetTitle>
                                    <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
                                    <hr className="bg-[#057A37] w-28 h-0.5" />
                                </div>
                                <div className="flex gap-1 pr-12">
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={handleRefreshCart}
                                                disabled={loading}
                                                variant="default"
                                                className="flex items-center gap-2 px-3 py-1 text-sm"
                                            >
                                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            sideOffset={10}
                                            avoidCollisions={true}
                                            className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-xl border-0"
                                            style={{ zIndex: 99999 }}
                                        >
                                            Refresh Cart
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* {cartItems.length > 0 && (
                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleClearCart}
                                                    disabled={loading}
                                                    variant="default"
                                                    className="flex items-center gap-2 px-3 py-1 text-sm text-red-600  hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
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
                                    )} */}
                                </div>
                            </div>
                        </SheetHeader>

                        {cartItems.length > 0 && (
                            <div className="bg-[#122014] p-3 text-sm text-center">
                                <p className="text-white">
                                    Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to{" "}
                                    <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                                </p>
                            </div>
                        )}

                        {cartError && (
                            <div className="bg-red-50 border border-red-200 p-3 text-sm text-center">
                                <p className="text-red-600">
                                    {cartError}
                                </p>
                                <button
                                    onClick={() => setCartError(null)}
                                    className="text-red-500 underline mt-1"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>

                    {
                        loading ? (
                            <div className="flex flex-1 justify-center items-center">
                                <div className="text-center text-gray-500 text-lg">
                                    <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                                    Loading cart items...
                                </div>
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div className="flex flex-1 justify-center items-center">
                                <div className="text-center">
                                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-center text-gray-500 text-lg mb-2">Your cart is empty</p>
                                    <p className="text-center text-gray-400 text-sm">Add some products to get started!</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                                    <div className="flex flex-col gap-4 bg-[#F2F9F3] rounded-[10px] px-2 py-3">
                                        {cartItems.map((item, index) => (
                                            <div key={`${item.id}-${item.product_id || 'no-product'}-${index}`} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={loading}
                                                    className="absolute -top-5 -right-5 border border-red-600 h-6 w-6 p-0 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed z-10 rounded-full transition-colors duration-200 cursor-pointer"
                                                    aria-label="Remove item from cart"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                                <div className="w-24 h-28 relative rounded-md overflow-hidden bg-gray-200">
                                                    <Image
                                                        src={item.image || "/placeholder.png"}
                                                        alt={item.name || "Product image"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <h3 className="font-[Grafiels] font-normal text-[15px] line-clamp-2">
                                                        {item.name}
                                                    </h3>

                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-normal text-[14px] text-[#057A37]">
                                                                {formatINR((item.price || 0) * item.quantity)}
                                                            </p>
                                                            <span className="text-[11px]">|</span>
                                                            <p className="text-[#747474] text-[10px]">
                                                                {item.mrp_price && item.discount_percent ? (
                                                                    <>
                                                                        MRP {formatINR(item.mrp_price * item.quantity)}
                                                                        <span className="text-[#057A37]"> {item.discount_percent}% Off</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-[#747474]">
                                                                        {item.product_id ? "Loading pricing..." : "No product ID"}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-2 bg-white w-36 rounded-full border border-[#057A37] px-2 py-1 overflow-hidden">
                                                            <Button
                                                                variant="default"
                                                                disabled={loading}
                                                                className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#057A37] hover:text-white transition-colors duration-200"
                                                                onClick={() => handleDecreaseQuantity(item.id)}
                                                            >
                                                                -
                                                            </Button>

                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={10}
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const newQuantity = Number(e.target.value) || 1;
                                                                    if (newQuantity >= 1 && newQuantity <= 10) {
                                                                        handleUpdateQuantity(item.id, newQuantity);
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    const newQuantity = Number(e.target.value) || 1;
                                                                    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
                                                                    if (clampedQuantity !== item.quantity) {
                                                                        handleUpdateQuantity(item.id, clampedQuantity);
                                                                    }
                                                                }}
                                                                className="w-10 text-center outline-none text-[#057A37] bg-transparent focus:bg-gray-50 rounded transition-colors duration-200"
                                                            />

                                                            <Button
                                                                variant="default"
                                                                disabled={loading}
                                                                className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#057A37] hover:text-white transition-colors duration-200"
                                                                onClick={() => handleIncreaseQuantity(item.id)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center mt-2">
                                                        <p className="text-[10px] text-[#747474] line-clamp-1 w-3/4">
                                                            {item.short_description || item.product_description || "Loading product details..."}
                                                        </p>
                                                        <p className="text-[14px] text-[#057A37]">
                                                            ₹{Math.round((item.price || 0) * item.quantity).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-md text-center">
                                        <div className="flex justify-center gap-4 mb-4">
                                            <button
                                                className={`px-3 py-1 rounded-full border leading-tight text-[13px] ${selectedPayment === "prepaid"
                                                    ? "border-green-600 bg-green-100"
                                                    : "border-gray-300"
                                                    }`}
                                                onClick={handlePrepaidClick}
                                            >
                                                Prepaid
                                            </button>
                                            <button
                                                className={`px-3 py-1 rounded-full border leading-tight text-[13px] ${selectedPayment === "cod"
                                                    ? "border-green-600 bg-green-100"
                                                    : "border-gray-300"
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
                                                <Image src="/assets/img/prepaid-image.png" alt="Prepaid" width={500} height={100} />
                                            </div>
                                        )}
                                        {selectedPayment === "cod" && (
                                            <div className="flex justify-center">
                                                <Image src="/assets/img/postpaid-image.png" alt="COD" width={500} height={100} />
                                            </div>
                                        )}
                                    </div>

                                    <DeliveryAddress
                                        key={addressRefreshKey}
                                        onAddAddress={() => setIsAddAddressOpen(true)}
                                        onAddressSelect={setSelectedAddress}
                                    />
                                </div>

                                <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
                                    <div>
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
                                    <div className="bg-[#FFF] px-3 py-1 rounded-full">
                                        <Button
                                            className="text-[#122014] font-normal text-[15px]"
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
                </SheetContent >
            </Sheet >
        </ErrorBoundary>
    );
}
