"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";
import { authApi } from "@/lib/api";
import Image from "next/image";
import { RiRefreshLine } from "react-icons/ri";

interface OtpVerifyFormProps {
    onVerified: () => void;
    phone: string;
    userData?: { name: string; email: string; phone: string }; // For registration
    isRegistration?: boolean;
}

export default function OtpVerifyForm({ onVerified, phone, userData, isRegistration = false }: OtpVerifyFormProps) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [resending, setResending] = useState(false);
    const { setUser, setSessionKey } = useAuth();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleResendOtp = async () => {
        setResending(true);
        try {
            await authApi.sendOtp({ phonenumber: phone });
            setCountdown(30);
            setCanResend(false);
            toast.success("OTP resent successfully!");
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Resend OTP failed:", error);
            }
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            if (isRegistration && userData) {
                const data = await authApi.register({
                    fullname: userData.name,
                    email: userData.email,
                    phonenumber: phone,
                    otp: otp
                });

                const apiData = data as Record<string, unknown>;

                if (apiData.status === false) {
                    const errorMessage = String(apiData.message || "Registration failed. Please try again.");

                    if (errorMessage.toLowerCase().includes("already exists") ||
                        errorMessage.toLowerCase().includes("already registered")) {
                        toast.error("This phone number is already registered. Please try logging in instead.");
                    } else {
                        toast.error(errorMessage);
                    }
                    return;
                }

                const rawUser = apiData.user || apiData.data || apiData;

                const normalizedUser = {
                    id: String((rawUser as Record<string, unknown>)?.userid || (rawUser as Record<string, unknown>)?.id || ""),
                    name: userData.name,
                    email: userData.email,
                    phone: String((rawUser as Record<string, unknown>)?.phone || (rawUser as Record<string, unknown>)?.phonenumber || phone),
                };

                const sessionKey = apiData.session_key || apiData.sessionKey || apiData.token || apiData.access_token || apiData.auth_token || apiData.jwt ||
                    (apiData.data && typeof apiData.data === 'object' ?
                        (apiData.data as Record<string, unknown>).session_key || (apiData.data as Record<string, unknown>).sessionKey || (apiData.data as Record<string, unknown>).token || (apiData.data as Record<string, unknown>).access_token || (apiData.data as Record<string, unknown>).auth_token || (apiData.data as Record<string, unknown>).jwt
                        : null) || null;

                setUser(normalizedUser);
                if (sessionKey) {
                    setSessionKey(String(sessionKey));
                    if (process.env.NODE_ENV === "development") {
                        console.log("🔐 Complete Session Key (Registration):", String(sessionKey));
                    }
                }

                try {
                    if (typeof window !== "undefined") {
                        localStorage.setItem("user", JSON.stringify(normalizedUser));
                        if (sessionKey) localStorage.setItem("session_key", String(sessionKey));
                    }
                } catch (err) {
                    if (process.env.NODE_ENV === "development") {
                        console.warn("Failed to save user in localStorage:", err);
                    }
                }

                toast.success(`Welcome to BEYUVANA, ${normalizedUser.name}! Your account has been created successfully.`);
            } else {
                const data = await authApi.login({
                    phonenumber: phone,
                    otp: otp
                });

                const apiData = data as Record<string, unknown>;

                if (apiData.status === false) {
                    const errorMessage = String(apiData.message || "Login failed. Please try again.");

                    if (errorMessage.includes("Phone No. or OTP Not Found") || errorMessage.includes("OTP Not Found")) {
                        toast.error("Invalid OTP or phone number. Please check your OTP and try again, or the OTP may have expired.");
                    } else if (errorMessage.includes("expired") || errorMessage.includes("timeout")) {
                        toast.error("OTP has expired. Please request a new OTP.");
                    } else if (errorMessage.includes("invalid") || errorMessage.includes("incorrect")) {
                        toast.error("Invalid OTP. Please check the 6-digit code and try again.");
                    } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
                        toast.error("Network error. Please check your internet connection and try again.");
                    } else {
                        toast.error(errorMessage);
                    }
                    return;
                }

                const rawUser = apiData.user || apiData.data || apiData;


                const normalizedUser = rawUser ? {
                    id: String((rawUser as Record<string, unknown>).userid || (rawUser as Record<string, unknown>).id || ""),
                    name: String((rawUser as Record<string, unknown>).name || (rawUser as Record<string, unknown>).fullname || ""),
                    email: String((rawUser as Record<string, unknown>).email || ""),
                    phone: String((rawUser as Record<string, unknown>).phone || (rawUser as Record<string, unknown>).phonenumber || phone),
                } : null;


                const sessionKey = apiData.session_key || apiData.sessionKey || apiData.token || apiData.access_token || apiData.auth_token || apiData.jwt ||
                    (apiData.data && typeof apiData.data === 'object' ?
                        (apiData.data as Record<string, unknown>).session_key || (apiData.data as Record<string, unknown>).sessionKey || (apiData.data as Record<string, unknown>).token || (apiData.data as Record<string, unknown>).access_token || (apiData.data as Record<string, unknown>).auth_token || (apiData.data as Record<string, unknown>).jwt
                        : null) || null;

                if (normalizedUser) {
                    setUser(normalizedUser);
                    if (sessionKey) {
                        setSessionKey(String(sessionKey));
                    }

                    if (process.env.NODE_ENV === "development") {
                        console.log("🔐 Login Successful - Session Key:", String(sessionKey || "N/A"));
                        console.log("👤 Login Successful - User ID:", normalizedUser.id);
                    }

                    try {
                        if (typeof window !== "undefined") {
                            localStorage.setItem("user", JSON.stringify(normalizedUser));
                            if (sessionKey) localStorage.setItem("session_key", String(sessionKey));
                        }
                    } catch (err) {
                        if (process.env.NODE_ENV === "development") {
                            console.warn("Failed to save user in localStorage:", err);
                        }
                    }

                    toast.success(`Welcome back, ${normalizedUser.name}!`);
                } else {
                    toast.error("Login failed. Please try again.");
                    return;
                }
            }

            onVerified();
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("OTP verification failed:", error);
            }
            const errorMessage = (error as Error)?.message || "Invalid OTP. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/2 hidden md:block">
                <Image
                    src="/assets/img/otp-img.png"
                    width={491}
                    height={780}
                    alt="OTP Illustration"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="w-full md:w-1/2 md:p-6 p-0 flex flex-col justify-center">
                <h2 className="text-[30px] text-[#057A37] mb-1 font-[Grafiels]">Verify OTP</h2>
                <hr className="w-32 h-0.5 mb-4 bg-[#057A37]" />
                <p className="text-sm text-[#118200]">We&apos;ve sent a 6-digit OTP to {phone}</p>
                <form onSubmit={handleSubmit} className="space-y-3 my-4">
                    <Input
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        maxLength={6}
                        required
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white bg-green-700 hover:bg-green-800 rounded-[5px] py-2 font-light ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                </form>
                <div className="flex flex-col items-center space-y-2">
                    {!canResend ? (
                        <p className="text-[12px] text-[#525252]">
                            Wait {countdown} secs to resend OTP
                        </p>
                    ) : (
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleResendOtp}
                            disabled={resending}
                            className="text-[12px] px-4 py-1 h-auto border-[#057A37] text-[#057A37] hover:underline flex items-center gap-1"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                            {!resending && <RiRefreshLine className="w-3 h-3" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
