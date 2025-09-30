"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi } from "@/lib/api";

interface RegisterFormProps {
    onClose?: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        // Basic phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(form.phone)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!form.password || form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const data = await authApi.register({
                fullname: form.name,
                email: form.email,
                phonenumber: form.phone,
                password: form.password,
            });

            console.log("Signup success:", data);
            toast.success("Signup successful!");
            onClose?.();
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again later.");
            toast.error("Signup failed. Please try again.");
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
                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
