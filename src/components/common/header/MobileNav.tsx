"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";

const links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/services" },
    { label: "Product", href: "/resume" },
    { label: "Contact", href: "/contact" }
];

const MobileNav = () => {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition">
                <CiMenuFries className="text-2xl text-[#1E2C1E]" />
            </SheetTrigger>

            <SheetContent className="flex flex-col px-6 py-8">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>

                {/* Navigation */}
                <nav className="flex flex-col gap-5 text-lg font-medium items-center justify-center">
                    {links.map((link) => (
                        <Link
                            href={link.href}
                            key={link.href}
                            className={`transition-colors px-2 py-1 rounded-md capitalize
                ${pathname === link.href
                                    ? "underline underline-offset-8 decoration-[1.5px] decoration-[#1E2C1E] text-[#1E2C1E]"
                                    : "hover:underline hover:underline-offset-8 hover:decoration-[1.5px] hover:decoration-[#1E2C1E] hover:text-[#1E2C1E] text-black"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;