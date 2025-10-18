"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi } from "@/lib/api";

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


        // Basic phone validation - ensure it's exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(form.phone)) {
            setError("Please enter a valid 10-digit phone number.");
            setLoading(false);
            return;
        }

        // Ensure phone number is exactly 10 digits for API
        const cleanPhone = form.phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            setLoading(false);
            return;
        }

        // Additional validation: Check if phone number starts with valid Indian mobile prefixes
        const validPrefixes = ['6', '7', '8', '9'];
        if (!validPrefixes.includes(cleanPhone[0])) {
            setError("Please enter a valid Indian mobile number (starting with 6, 7, 8, or 9).");
            setLoading(false);
            return;
        }

        try {

            // Try different phone number formats that the API might accept
            const phoneFormats = [
                cleanPhone,                    // 7003810162
                `+91${cleanPhone}`,           // +917003810162
                `91${cleanPhone}`,            // 917003810162
                `0${cleanPhone}`,             // 07003810162
                `+91-${cleanPhone}`,          // +91-7003810162
                `91-${cleanPhone}`,           // 91-7003810162
            ];

            let response;
            let successfulFormat = null;

            for (const phoneFormat of phoneFormats) {
                try {
                    response = await authApi.sendOtp({ phonenumber: phoneFormat });

                    if (response.status !== false) {
                        successfulFormat = phoneFormat;
                        break;
                    }
                } catch {
                    // Continue trying other formats
                }
            }

            if (!successfulFormat || !response) {
                throw new Error("Failed to send OTP with any phone number format. Please check your phone number.");
            }

            // Store phone for OTP verification
            onOtpSent?.(successfulFormat);

            toast.success("OTP sent to your phone number. Please verify to login.");
        } catch (err: unknown) {
            // Try to extract error message from API response
            const errorMessage = (err as Error)?.message || "Failed to send OTP. Please try again later.";
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

            {/* Right Form */}
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
