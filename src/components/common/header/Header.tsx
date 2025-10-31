"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import RegisterForm from "@/app/auth/RegisterForm";
import LoginForm from "@/app/auth/LoginForm";
import OtpVerifyForm from "@/app/auth/OtpVerifyForm";
import { useAuth } from "@/context/AuthProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/app/auth/LogoutButton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Cart from "../cart/Cart";
import { RiLogoutCircleLine } from "react-icons/ri";
import { TbSettings2 } from "react-icons/tb";
import { useState } from "react";
import { TbUserSquareRounded } from "react-icons/tb";


const Header = () => {
    const { user } = useAuth();
    // const { cartItems } = useCart();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerStep, setRegisterStep] = useState<"form" | "otp">("form");
    const [loginStep, setLoginStep] = useState<"form" | "otp">("form");
    const [otpData, setOtpData] = useState<{
        phone: string;
        userData?: { name: string; email: string; phone: string };
    } | null>(null);

    const handleRegisterOtpSent = (phone: string, userData?: { name: string; email: string; phone: string }) => {
        setOtpData({ phone, userData });
        setRegisterStep("otp");
    };

    const handleRegisterOtpVerified = () => {
        setRegisterStep("form");
        setOtpData(null);
        setIsRegisterOpen(false);
    };


    const handleLoginOtpSent = (phone: string) => {
        setOtpData({ phone });
        setLoginStep("otp");
    };

    const handleLoginOtpVerified = () => {
        setLoginStep("form");
        setOtpData(null);
        setIsLoginOpen(false);
    };


    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Logo */}
            <div className="flex items-center justify-center bg-[#122014]">
                <Link href="/" className="transition hover:opacity-80">
                    <Image
                        src="/assets/img/logo.png"
                        width={120}
                        height={32}
                        alt="Beyuvana logo"
                    />
                </Link>
            </div>

            <div className="bg-white px-4 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="hidden lg:flex items-center justify-between gap-6 py-2">
                        <Nav />

                        <div className="flex items-center gap-x-4">
                            <Cart />

                            {!user ? (
                                <>
                                    {/* Login */}
                                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="text-white text-[14px] font-normal inline-flex gap-x-2 bg-[#1A2819] shadow-md shadow-gray-500/30 px-6 py-2 rounded-full hover:brightness-110 transition-all duration-200"
                                                onClick={() => setIsLoginOpen(true)}
                                            >
                                                <RiLogoutCircleLine />
                                                Login
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#F4FFF9] border border-[#1E2C1E] text-white rounded-2xl w-[90%] max-w-[800px]">
                                            <DialogHeader>
                                                <VisuallyHidden>
                                                    <DialogTitle>{loginStep === "otp" ? "Verify OTP" : "Login"}</DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>

                                            {loginStep === "otp" && otpData ? (
                                                <div className="space-y-4">
                                                    {/* <div className="text-center">
                                                        <p className="text-sm text-gray-600">
                                                            We&apos;ve sent a 6-digit OTP to {otpData.phone}
                                                        </p>
                                                    </div> */}
                                                    <OtpVerifyForm
                                                        onVerified={handleLoginOtpVerified}
                                                        phone={otpData.phone}
                                                        isRegistration={false}
                                                    />
                                                    {/* <Button
                                                        variant="outline"
                                                        onClick={handleBackToLogin}
                                                        className="w-full"
                                                    >
                                                        Back to Login
                                                    </Button> */}
                                                </div>
                                            ) : (
                                                <LoginForm
                                                    onClose={() => setIsLoginOpen(false)}
                                                    onOtpSent={handleLoginOtpSent}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {/* Register */}
                                    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="text-black inline-flex gap-x-2 text-[14px] font-normal shadow-md shadow-gray-500/30 px-6 py-2 rounded-full hover:brightness-110 transition-all duration-200"
                                                onClick={() => setIsRegisterOpen(true)}
                                            >
                                                <TbSettings2 />
                                                Register
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#F4FFF9] border border-[#1E2C1E] text-black rounded-2xl w-[90%] max-w-[800px]">
                                            <DialogHeader>
                                                <VisuallyHidden>
                                                    <DialogTitle className="text-xl font-bold mb-3">
                                                        {registerStep === "otp" ? "Verify OTP" : "Create your account"}
                                                    </DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>

                                            {registerStep === "otp" && otpData ? (
                                                <div className="space-y-4">
                                                    {/* <div className="text-center">
                                                        <p className="text-sm text-gray-600">
                                                            We&apos;ve sent a 6-digit OTP to {otpData.phone}
                                                        </p>
                                                    </div> */}
                                                    <OtpVerifyForm
                                                        onVerified={handleRegisterOtpVerified}
                                                        phone={otpData.phone}
                                                        userData={otpData.userData}
                                                        isRegistration={true}
                                                    />
                                                    {/* <Button
                                                        variant="outline"
                                                        onClick={handleBackToRegister}
                                                        className="w-full"
                                                    >
                                                        Back to Registration
                                                    </Button> */}
                                                </div>
                                            ) : (
                                                <RegisterForm
                                                    onClose={() => setIsRegisterOpen(false)}
                                                    onOtpSent={handleRegisterOtpSent}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : (
                                // User dropdown
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="inline-flex gap-x-2 rounded-full shadow px-4 font-normal py-2 capitalize bg-[#1A2819] text-white text-[12px]">
                                            <TbUserSquareRounded className="w-5 h-5" />
                                            {user.name || "User"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-38">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {/* <DropdownMenuItem>
                                            <Link
                                                href="/profile"
                                                className="w-full block"
                                                onClick={() => {}}
                                            >
                                                Profile
                                            </Link>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuItem>
                                            <Link
                                                href="/orders"
                                                className="w-full block"
                                                onClick={() => { }}
                                            >
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <LogoutButton />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <div className="lg:hidden">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
