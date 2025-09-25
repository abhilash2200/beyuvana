"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";

export default function OtpVerifyForm({ onVerified }: { onVerified: () => void }) {
    const [otp, setOtp] = useState("");
    const { setUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ otp }),
            });
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                toast.success("OTP verified successfully!");
                onVerified();
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
            toast.error("OTP verification failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <Input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
    );
}
