"use client";

import { useState } from "react";

interface OtpData {
    phone: string;
    userData?: { name: string; email: string; phone: string };
}

interface UseAuthDialogReturn {
    // State
    isLoginOpen: boolean;
    isRegisterOpen: boolean;
    loginStep: "form" | "otp";
    registerStep: "form" | "otp";
    otpData: OtpData | null;

    // Setters
    setIsLoginOpen: (open: boolean) => void;
    setIsRegisterOpen: (open: boolean) => void;

    // Handlers
    handleLoginOtpSent: (phone: string) => void;
    handleLoginOtpVerified: () => void;
    handleRegisterOtpSent: (phone: string, userData?: { name: string; email: string; phone: string }) => void;
    handleRegisterOtpVerified: () => void;
}

/**
 * Custom hook to manage authentication dialog state and logic
 * Extracted from Header and MobileNav to eliminate duplication
 */
export function useAuthDialog(): UseAuthDialogReturn {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerStep, setRegisterStep] = useState<"form" | "otp">("form");
    const [loginStep, setLoginStep] = useState<"form" | "otp">("form");
    const [otpData, setOtpData] = useState<OtpData | null>(null);

    const handleRegisterOtpSent = (phone: string, userData?: { name: string; email: string; phone: string }) => {
        if (process.env.NODE_ENV === "development") {
            console.log("🔍 useAuthDialog - handleRegisterOtpSent called with:", { phone, userData });
        }
        setOtpData({ phone, userData });
        setRegisterStep("otp");
    };

    const handleRegisterOtpVerified = () => {
        setRegisterStep("form");
        setOtpData(null);
        setIsRegisterOpen(false);
    };

    const handleLoginOtpSent = (phone: string) => {
        if (process.env.NODE_ENV === "development") {
            console.log("🔍 useAuthDialog - handleLoginOtpSent called with:", { phone });
        }
        setOtpData({ phone });
        setLoginStep("otp");
    };

    const handleLoginOtpVerified = () => {
        setLoginStep("form");
        setOtpData(null);
        setIsLoginOpen(false);
    };

    return {
        isLoginOpen,
        isRegisterOpen,
        loginStep,
        registerStep,
        otpData,
        setIsLoginOpen,
        setIsRegisterOpen,
        handleLoginOtpSent,
        handleLoginOtpVerified,
        handleRegisterOtpSent,
        handleRegisterOtpVerified,
    };
}

