"use client";

import React from "react";
import { fallbackProducts } from "@/app/data/fallbackProducts";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ProductFaqProps {
    productId: number;
}

const ProductFaq = ({ productId }: ProductFaqProps) => {
    const product = fallbackProducts.find(p => p.id === productId);
    const faqData = product?.customFaq || [];
    const colors = {
        1: {
            bgColor: "#E9F8EE",
            iconColor: "text-green-700",
            borderColor: "border-[#000]"
        },
        2: {
            bgColor: "#FFE7E7",
            iconColor: "text-red-700",
            borderColor: "border-[#000]"
        }
    };

    const currentColors = colors[productId as keyof typeof colors] || colors[1];
    return (
        <div className="max-w-[80%] mx-auto py-10">
            <Accordion
                type="single"
                collapsible
                defaultValue={faqData.length > 0 ? faqData[0].id : ""}
                className="space-y-4"
            >
                {faqData.map((faq, index) => (
                    <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="rounded-2xl px-6 py-4 !border-0"
                        style={{ backgroundColor: currentColors.bgColor }}
                    >
                        <AccordionTrigger
                            className={cn(
                                "flex items-center justify-between w-full group text-left pr-0 hover:cursor-pointer transition-colors duration-300 no-underline hover:no-underline",
                                " [&[data-state=open]>div>span.icon]:before:content-['−']",
                                " [&[data-state=closed]>div>span.icon]:before:content-['+']",
                                " [&>svg]:hidden"
                            )}
                        >
                            <div className="flex items-start gap-4 text-left">
                                <span className="font-bold text-[#2D2D2D] text-[18px]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="font-medium text-[#2D2D2D] text-[18px]">
                                    {faq.question}
                                </span>
                            </div>

                            <div className={cn("w-8 h-8 flex items-center justify-center rounded-full border", currentColors.borderColor)}>
                                <span className={cn("icon text-[18px] leading-none font-normal", currentColors.iconColor)} />
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="pl-10 pt-2 text-sm text-[#2D2D2D] text-[18px]">
                            {faq.answer.map((ans, answerIndex) => (
                                <p key={answerIndex} className="mb-1">
                                    {ans}
                                </p>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default ProductFaq;
