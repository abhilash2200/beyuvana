"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi } from "@/lib/api";

interface RegisterFormProps {
    onClose?: () => void;
    onOtpSent?: (phone: string, userData: { name: string; email: string; phone: string }) => void;
}

export default function RegisterForm({ onOtpSent }: RegisterFormProps) {
    console.log("🔍 RegisterForm - onOtpSent prop:", onOtpSent);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        // Basic phone validation - ensure it's exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(form.phone)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        // Ensure phone number is exactly 10 digits for API
        const cleanPhone = form.phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        // Additional validation: Check if phone number starts with valid Indian mobile prefixes
        const validPrefixes = ['6', '7', '8', '9'];
        if (!validPrefixes.includes(cleanPhone[0])) {
            setError("Please enter a valid Indian mobile number (starting with 6, 7, 8, or 9).");
            return;
        }

        if (!form.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!form.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setLoading(true);

        try {

            // First, check if user already exists using register API with dummy data
            try {
                const userCheckResponse = await authApi.register({
                    fullname: "dummy",
                    email: "dummy@example.com",
                    phonenumber: cleanPhone,
                    otp: "000000" // Dummy OTP
                });


                // If user already exists, show error and return
                if (userCheckResponse.status === false &&
                    userCheckResponse.message?.includes("Already Exists")) {
                    setError("This phone number is already registered. Please try logging in instead.");
                    return;
                }
            } catch {
                // Continue with OTP sending even if check fails
            }

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

            // Store user data for after OTP verification
            onOtpSent?.(successfulFormat, {
                name: form.name,
                email: form.email,
                phone: successfulFormat
            });

            toast.success("OTP sent to your phone number. Please verify to complete registration.");
        } catch (err: unknown) {
            console.error("❌ RegisterForm - OTP send failed:", err);
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
            {/* Left Image */}
            <div className="w-full md:w-1/2 hidden md:block">
                <Image
                    src="/assets/img/login-img.png"
                    width={491}
                    height={780}
                    alt="Register Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 md:p-6 p-0 flex flex-col justify-center">
                <h2 className="text-[30px] text-[#057A37] mb-1 font-[Grafiels]">Register Now!</h2>
                <hr className="w-32 h-0.5 mb-4 bg-[#057A37]" />

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Phone"
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
