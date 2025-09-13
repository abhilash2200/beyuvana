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
import LoginPopup from "../../login/LoginPopup";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="flex items-center justify-center bg-[#1E2C1E]">
                <Link href="/" className="transition hover:opacity-80">
                    <Image src="/assets/img/logo.png" width={120} height={32} alt="Beyuvana logo" />
                </Link>
            </div>
            <div className="bg-white px-4 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="hidden lg:flex items-center justify-between gap-6">
                        <Nav />

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="text-black shadow-md shadow-indigo-500/30 px-6 py-2 rounded-full hover:brightness-110 transition-all duration-200">
                                    Login
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-[#ffc9170f] border border-[#1E2C1E] text-black rounded-2xl w-[90%] max-w-[800px]">
                                <DialogHeader className="border-b border-[#1E2C1E] px-4 sm:px-6">
                                    <DialogTitle className="text-xl font-bold mb-3">
                                        Let’s work together!
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="py-6 px-4 sm:px-6">
                                    <LoginPopup />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="lg:hidden">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>

    );
};

export default Header;