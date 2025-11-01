"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaWhatsapp, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";

type LinkItem = {
    name: string;
    href: string;
};

type SocialItem = {
    icon: React.ReactNode;
    href: string;
    label: string;
};

const quickLinks: LinkItem[] = [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping & Returns", href: "/shipping-and-return" },
    { name: "Product", href: "/product" },
];

const legalLinks: LinkItem[] = [
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Cancellation Policy", href: "/cancellation-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
];

const socialLinks: SocialItem[] = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaWhatsapp />, href: "#", label: "Whatsapp" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
];

const contactInfo = [
    { icon: <MdPhone />, text: "+91 8777377060", href: "tel:+918777377060" },
    { icon: <MdEmail />, text: "info.beyuvana@gmail.com", href: "mailto:info.beyuvana@gmail.com" },
    { icon: <MdLocationOn />, text: "Kolkata, India", href: "https://www.google.com/maps/place/Beyuvana/@22.5726487,88.363755,15z/data=!4m6!3m5!1s0x3a027599e21da86b:0x1c5cc322f207770!8m2!3d22.5726487!4d88.363755!16s%2Fg%2F11b5652p4k?entry=ttu&g_ep=EgoyMDI1MTAxMy4wIKXMDSoASAFQAw%3D%3D" },
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#122014] text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 text-left">
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <Image
                                src="/assets/img/logo.png"
                                width={200}
                                height={100}
                                alt="Beyuvana Logo"
                                className="object-contain"
                            />
                        </div>
                        <p className="text-white/70 text-sm">
                            At Beyuvana, we are committed to providing high-quality, plant-based collagen products
                            that support your health and beauty goals. Our products are made with sustainably sourced
                            ingredients and are cruelty-free, ensuring you receive the best without compromising your values.
                        </p>
                    </div>

                    <div className="md:pt-10 pt-0 md:pl-10 flex flex-col items-start justify-start text-left">
                        <h2 className="text-[#DFC362] mb-6 font-[Grafiels] text-[25px]">Quick Links</h2>
                        <ul className="space-y-2 text-white/70 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.name} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#DFC362] rounded-full inline-block"></span>
                                    <a href={link.href} className="hover:text-[#DFC362] transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className="md:pt-10 pt-0 flex flex-col items-start justify-start text-left">
                        <h2 className="text-[#DFC362] mb-6 font-[Grafiels] text-[25px]">Legal Links</h2>
                        <ul className="space-y-2 text-white/70 text-sm">
                            {legalLinks.map((link) => (
                                <li key={link.name} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#DFC362] rounded-full inline-block"></span>
                                    <a href={link.href} className="hover:text-[#DFC362] transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:pt-10 pt-0 flex flex-col items-start justify-start text-left">
                        <h2 className="text-[#DFC362] mb-6 font-[Grafiels] text-[25px]">Contact</h2>
                        <ul className="space-y-2 text-white/70 text-sm mb-4">
                            {contactInfo.map((item, index) => (
                                <a href={item.href} key={index} className="flex items-center gap-2">
                                    <span className="text-[#DFC362] text-lg">{item.icon}</span>
                                    {item.text}
                                </a>
                            ))}
                        </ul>
                        <h2 className="text-[#DFC362] mb-2 font-[Grafiels] text-[1.2rem]">Social Links</h2>
                        <div className="flex gap-4 text-white">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="hover:text-[#DFC362] transition-colors text-xl"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                <hr className="my-6 border-white/20" />
                <div className="flex items-center justify-between md:flex-row flex-col gap-y-4">
                    <p className="text-center text-white text-sm">
                        © {new Date().getFullYear()} @beyuvana2025 • All rights reserved
                    </p>
                    <p className="text-center capitalize text-white text-sm">
                        design and developed by <a href="https://digitalwolf.co.in/" className="text-[#DFC362] hover:text-[#DFC362] transition-colors">Digital wolf</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;