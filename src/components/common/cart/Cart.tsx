"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MobileCart from "./MobileCart";
import { ErrorBoundary } from "../ErrorBoundary";
import { useAuth } from "@/context/AuthProvider";
import type { SavedAddress } from "@/lib/api/types";
import { useCheckout } from "@/hooks/useCheckout";
import { calculateCartTotals } from "@/lib/cart-utils";
import { handleError } from "@/lib/error-handling";
import { CartHeader } from "./CartHeader";
import { CartErrorDisplay } from "./CartErrorDisplay";
import { CartItemsList } from "./CartItemsList";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CartSummary } from "./CartSummary";
import { CartConfetti } from "./CartConfetti";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import { useCartPromo } from "@/hooks/useCartPromo";
import { useCartConfetti } from "@/hooks/useCartConfetti";
import { hasTrialPack } from "@/lib/cart-utils";

export default function Cart() {
  const {
    cartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    updateItemQuantity,
    refreshCart,
    removeFromCart,
    clearCart,
    loading,
    isCartOpen,
    setCartOpen,
  } = useCart();
  const { user, sessionKey } = useAuth();
  const cartTotals = calculateCartTotals(cartItems);
  const [selectedPayment, setSelectedPayment] = React.useState<
    "prepaid" | "cod" | null
  >(null);
  const [selectedAddress, setSelectedAddress] =
    React.useState<SavedAddress | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
  const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [cartError, setCartError] = React.useState<string | null>(null);

  // Use promo hook
  const { promoValue, promoCode, handlePrepaidClick, handleCODClick } =
    useCartPromo({
      user,
      sessionKey,
      cartItems,
    });

  // Use confetti hook
  const { showConfetti, setLastIncreaseTime } = useCartConfetti();

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
    promoCode: hasTrialPack(cartItems)
      ? ""
      : selectedPayment === "prepaid"
      ? promoCode
      : "",
    promoAmount: hasTrialPack(cartItems)
      ? 0
      : selectedPayment === "prepaid"
      ? promoValue
      : 0,
    discountedTotal: hasTrialPack(cartItems)
      ? undefined
      : selectedPayment === "prepaid" && promoValue > 0
      ? total
      : undefined,
  });

  // Mobile detection
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Reset payment and address selection when cart opens
  React.useEffect(() => {
    if (isCartOpen) {
      setSelectedPayment(null);
      setSelectedAddress(null);
      handleCODClick(); // Reset promo code
    }
  }, [isCartOpen]);

  const handleSheetOpenChange = (open: boolean) => {
    setCartOpen(open);
    // Reset payment and address selection when cart is closed
    if (!open) {
      setSelectedPayment(null);
      setSelectedAddress(null);
      handleCODClick(); // Reset promo code
    }
  };

  const handleIncreaseQuantity = async (itemId: string) => {
    try {
      setCartError(null);
      await increaseItemQuantity(itemId);
      setLastIncreaseTime(Date.now());
    } catch (error) {
      const appError = handleError(error, {
        context: "Cart",
        userMessage: "Failed to update quantity. Please try again.",
        showToast: false,
      });
      setCartError(
        appError.userMessage || "Failed to update quantity. Please try again.",
      );
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
      setCartError(
        appError.userMessage || "Failed to update quantity. Please try again.",
      );
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
      setCartError(
        appError.userMessage || "Failed to update quantity. Please try again.",
      );
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setCartError(null);
      await removeFromCart(itemId);
    } catch (error) {
      const appError = handleError(error, {
        context: "Cart",
        userMessage: "Failed to remove item. Please try again.",
        showToast: false,
      });
      setCartError(
        appError.userMessage || "Failed to remove item. Please try again.",
      );
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
      setCartError(
        appError.userMessage || "Failed to refresh cart. Please try again.",
      );
    }
  };

  const handlePrepaidSelection = async () => {
    await handlePrepaidClick();
    setSelectedPayment("prepaid");
  };

  const handleCODSelection = () => {
    handleCODClick();
    setSelectedPayment("cod");
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
              <Button className="relative" aria-label="Open cart">
                <ShoppingCart className="w-6 h-6 text-black" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#057A37] rounded-full" />
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-gray-800 text-white text-[12px] px-3 py-2 rounded-md shadow-xl border-0"
            sideOffset={8}
          >
            Open cart
          </TooltipContent>
        </Tooltip>
        <SheetContent
          side="right"
          aria-describedby={undefined}
          className="bg-white p-0 h-screen flex flex-col relative gap-0"
          style={{
            zIndex: 1002,
            width: "450px",
            maxWidth: "90vw",
            right: "0",
            top: "0",
            bottom: "0",
            position: "fixed",
            overflow: "visible",
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <CartConfetti show={showConfetti} width={450} />

          <CartHeader
            loading={loading}
            onRefresh={handleRefreshCart}
            cartItemsCount={cartItems.length}
          />

          <CartErrorDisplay
            error={cartError}
            onDismiss={() => setCartError(null)}
          />

          {cartItems.length > 0 ? (
            <>
              <CartItemsList
                items={cartItems}
                loading={loading}
                onRemove={handleRemoveItem}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onUpdateQuantity={handleUpdateQuantity}
              >
                <div className="rounded-md text-center">
                  <PaymentMethodSelector
                    selectedPayment={selectedPayment}
                    onSelectPrepaid={handlePrepaidSelection}
                    onSelectCOD={handleCODSelection}
                  />
                </div>

                <DeliveryAddress
                  key={addressRefreshKey}
                  onAddAddress={() => setIsAddAddressOpen(true)}
                  onAddressSelect={setSelectedAddress}
                />
              </CartItemsList>

              <CartSummary
                total={total}
                selectedPayment={selectedPayment}
                isProcessingCheckout={isProcessingCheckout}
                loading={loading}
                onCheckout={handleCheckout}
              />

              <AddAddressSheet
                open={isAddAddressOpen}
                onOpenChange={setIsAddAddressOpen}
                onAddressSaved={() => {
                  setAddressRefreshKey((prev) => prev + 1);
                }}
              />
            </>
          ) : (
            <CartItemsList
              items={cartItems}
              loading={loading}
              onRemove={handleRemoveItem}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </SheetContent>
      </Sheet>
    </ErrorBoundary>
  );
}
