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
import { toast } from "react-toastify";
import { TbSettings2 } from "react-icons/tb";
import { useState } from "react";
import { TbUserSquareRounded } from "react-icons/tb";


const Header = () => {
    const { user } = useAuth();
    // const { cartItems } = useCart();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Logo */}
            <div className="flex items-center justify-center bg-[#1E2C1E]">
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
                                                    <DialogTitle>Login</DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>
                                            <LoginForm
                                                onClose={() => setIsLoginOpen(false)}
                                            // 🔹 OTP API comment preserved inside LoginForm
                                            />
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
                                                        Create your account
                                                    </DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>
                                            <RegisterForm onClose={() => setIsRegisterOpen(false)} />
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
                                        <DropdownMenuItem>
                                            <Link
                                                href="/profile"
                                                className="w-full block"
                                                onClick={() => toast.info("Navigating to profile...")}
                                            >
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link
                                                href="/orders"
                                                className="w-full block"
                                                onClick={() => toast.info("Navigating to orders...")}
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
