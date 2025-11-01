"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import OtpVerifyForm from "./OtpVerifyForm";
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthDialog() {
    const { user } = useAuth();
    const [step, setStep] = useState<"login" | "register" | "otp" | null>("login");
    const [otpData, setOtpData] = useState<{
        phone: string;
        userData?: { name: string; email: string; phone: string };
        isRegistration: boolean;
    } | null>(null);

    const handleOtpSent = (phone: string, userData?: { name: string; email: string; phone: string }) => {
        setOtpData({
            phone,
            userData,
            isRegistration: !!userData
        });
        setStep("otp");
    };

    const handleOtpVerified = () => {
        setStep(null);
        setOtpData(null);
    };

    const handleBackToAuth = () => {
        setStep(otpData?.isRegistration ? "register" : "login");
        setOtpData(null);
    };

    return (
        <Dialog onOpenChange={(o) => {
            if (!o) {
                setStep("login");
                setOtpData(null);
            }
        }}>
            <DialogTrigger asChild>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{user.name || "Account"}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <LogoutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="default">Login / Register</Button>
                )}
            </DialogTrigger>

            {!user && (
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {step === "otp" ? "Verify OTP" : "Login or Register"}
                        </DialogTitle>
                    </DialogHeader>

                    {step === "otp" && otpData ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    We&apos;ve sent a 6-digit OTP to {otpData.phone}
                                </p>
                            </div>
                            <OtpVerifyForm
                                onVerified={handleOtpVerified}
                                phone={otpData.phone}
                                userData={otpData.userData}
                                isRegistration={otpData.isRegistration}
                            />
                            <Button
                                variant="outline"
                                onClick={handleBackToAuth}
                                className="w-full"
                            >
                                Back to {otpData.isRegistration ? "Registration" : "Login"}
                            </Button>
                        </div>
                    ) : (
                        <Tabs value={step ?? "login"} onValueChange={(val) => setStep(val as "login" | "register")} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <LoginForm onOtpSent={handleOtpSent} />
                            </TabsContent>
                            <TabsContent value="register">
                                <RegisterForm
                                    key="register-form"
                                    onOtpSent={handleOtpSent}
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            )}
        </Dialog>
    );
}
