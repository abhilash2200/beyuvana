"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    RiMenu2Fill,
    RiHome2Line,
    RiInformationLine,
    RiShoppingBag3Line,
    RiPhoneLine,
    RiFileList2Line,
    RiLogoutCircleLine,
} from "react-icons/ri";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "@/app/auth/LogoutButton";
import LoginForm from "@/app/auth/LoginForm";
import RegisterForm from "@/app/auth/RegisterForm";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Cart from "../cart/Cart";

const links = [
    { label: "Home", href: "/", icon: <RiHome2Line className="text-lg" /> },
    { label: "About Us", href: "/about-us", icon: <RiInformationLine className="text-lg" /> },
    { label: "Product", href: "/product", icon: <RiShoppingBag3Line className="text-lg" /> },
    { label: "Contact", href: "/contact", icon: <RiPhoneLine className="text-lg" /> },
];

const MobileNav = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 w-full bg-white px-3 py-2 flex items-center justify-between">
            <Sheet>
                <SheetTrigger className="p-2 rounded-md hover:bg-gray-100">
                    <RiMenu2Fill className="text-2xl text-[#1E2C1E]" />
                </SheetTrigger>

                <SheetContent side="left" className="flex flex-col px-6 py-6 h-full justify-between">
                    <div>
                        <SheetTitle className="sr-only">Main Menu</SheetTitle>

                        {/* 🔹 User section */}
                        <div className="mb-6 border-b border-gray-200 pb-4">
                            {!user ? (
                                <div className="flex gap-3">
                                    {/* Login Dialog */}
                                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="bg-[#1A2819] text-white font-normal text-sm px-4 py-1 rounded-[5px]"
                                                onClick={() => setIsLoginOpen(true)}
                                            >
                                                Login
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#F4FFF9] border border-[#1E2C1E] text-black rounded-2xl w-[90%] max-w-[800px]">
                                            <DialogHeader>
                                                <VisuallyHidden>
                                                    <DialogTitle>Login</DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>
                                            <LoginForm onClose={() => setIsLoginOpen(false)} />
                                        </DialogContent>
                                    </Dialog>

                                    {/* Register Dialog */}
                                    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="bg-gray-200 text-[#1E2C1E] font-normal text-sm px-4 py-1 rounded-[5px]"
                                                onClick={() => setIsRegisterOpen(true)}
                                            >
                                                Register
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#F4FFF9] border border-[#1E2C1E] text-black rounded-2xl w-[90%] max-w-[800px]">
                                            <DialogHeader>
                                                <VisuallyHidden>
                                                    <DialogTitle>Create your account</DialogTitle>
                                                </VisuallyHidden>
                                            </DialogHeader>
                                            <RegisterForm onClose={() => setIsRegisterOpen(false)} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ) : (
                                <span className="font-semibold text-[#1E2C1E]">
                                    Hello, {user.name || "User"}
                                </span>
                            )}
                        </div>

                        {/* 🔹 Navigation links */}
                        <nav className="flex flex-col gap-5 text-lg font-medium">
                            {links.map((link) => (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    className={`flex items-center gap-3 transition-colors px-2 py-1 rounded-md capitalize
                    ${pathname === link.href
                                            ? "decoration-[1.5px] decoration-[#1E2C1E] text-[#1E2C1E]"
                                            : "hover:decoration-[1.5px] hover:decoration-[#1E2C1E] hover:text-[#1E2C1E] text-black"
                                        }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    href="/orders"
                                    className={`flex items-center gap-3 transition-colors px-2 py-1 rounded-md capitalize
                    ${pathname === "/orders"
                                            ? "underline underline-offset-8 decoration-[1.5px] decoration-[#1E2C1E] text-[#1E2C1E]"
                                            : "hover:underline hover:underline-offset-8 hover:decoration-[1.5px] hover:decoration-[#1E2C1E] hover:text-[#1E2C1E] text-black"
                                        }`}
                                >
                                    <RiFileList2Line className="text-lg" />
                                    Orders
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* 🔹 Bottom Logout */}
                    {user && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <LogoutButton>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-red-600 w-full justify-start"
                                >
                                    <RiLogoutCircleLine className="text-lg" />
                                    Logout
                                </Button>
                            </LogoutButton>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Cart />
        </div>
    );
};

export default MobileNav;
