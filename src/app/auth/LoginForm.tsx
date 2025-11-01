"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi } from "@/lib/api";
import { validatePhone } from "@/lib/validation";

interface LoginFormProps {
    onClose?: () => void;
    onOtpSent?: (phone: string) => void;
}

export default function LoginForm({ onOtpSent }: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ phone: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);


        const phoneValidation = validatePhone(form.phone);
        if (!phoneValidation.isValid) {
            setError(phoneValidation.error || "Please enter a valid phone number.");
            setLoading(false);
            return;
        }

        const cleanPhone = form.phone.replace(/\D/g, "");

        try {
            const response = await authApi.sendOtp({ phonenumber: cleanPhone });

            if (response.status === false) {
                const errorMsg = response.message || "OTP send failed";
                throw new Error(errorMsg);
            }

            onOtpSent?.(cleanPhone);

            toast.success("OTP sent to your phone number. Please verify to login.");
        } catch (err: unknown) {
            if (process.env.NODE_ENV === "development") {
                console.error("Login form error:", err);
            }
            let errorMessage = "Failed to send OTP. Please try again later.";

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            if (errorMessage.includes("Invalid phone number") || errorMessage.includes("phone")) {
                errorMessage = "Please enter a valid 10-digit Indian mobile number.";
            } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
                errorMessage = "Network error. Please check your internet connection and try again.";
            } else if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
                errorMessage = "Too many attempts. Please wait a few minutes before trying again.";
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/2 hidden md:block">
                <Image
                    src="/assets/img/login-img.png"
                    width={491}
                    height={780}
                    alt="Login Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full md:w-1/2 md:p-6 p-0 flex flex-col justify-center">
                <h2 className="text-[30px] text-[#057A37] mb-1 font-[Grafiels]">Login Now!</h2>
                <hr className="w-32 h-0.5 mb-4 bg-[#057A37]" />

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setForm({ ...form, phone: val });
                        }}
                        maxLength={10}
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <p className="text-[10px] text-gray-500">
                        By continuing, you agree to Beyuvana’s Terms of Use and Privacy Policy.
                    </p>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white bg-green-700 hover:bg-green-800 rounded-[5px] py-2 font-light ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
