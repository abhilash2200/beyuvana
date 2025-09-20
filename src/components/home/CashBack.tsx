"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import CashBackPopup from "./CashBackPopup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ToxinItem {
    img: string;
    text: string;
    isButton?: boolean;
}

const toxinItems: ToxinItem[] = [
    { img: "/assets/img/free-shipping.png", text: "Free Shipping of\norder above ₹1500" },
    { img: "/assets/img/cash-on-delivery.png", text: "Cash On\nDelivery" },
    { img: "/assets/img/load.png", text: "24 Hour\nDispatch" },
    { img: "/assets/img/free-shipping.png", text: "Money Back\nGuarantee*", isButton: true },
];

const CashBack: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-wrap justify-around">
                {toxinItems.map((item, index) => (
                    <div
                        key={index}
                        className={`w-[50%] md:w-[24%] ${index !== toxinItems.length - 1 ? "md:border-r md:border-black" : ""}`}
                    >
                        <div className="flex gap-x-2 items-center justify-center">
                            <Image src={item.img} width={70} height={70} alt={item.text} />
                            {item.isButton ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="whitespace-pre-line text-[#0C4B33] md:text-[16px] text-[14px] animate-glow">
                                            {item.text}
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="bg-[#fff] border border-[#1E2C1E] text-black rounded-2xl w-[90%] max-w-[1000px]">
                                        <DialogHeader className="border-b border-[#1E2C1E">
                                        <VisuallyHidden>
                                            <DialogTitle className="text-xl font-bold mb-3">
                                                Money Back Guarantee
                                            </DialogTitle>
                                        </VisuallyHidden>
                                        </DialogHeader>

                                        <div className="p-0">
                                            <CashBackPopup />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <p className="whitespace-pre-line text-[#000] md:text-[16px] text-[14px]">{item.text}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CashBack;
