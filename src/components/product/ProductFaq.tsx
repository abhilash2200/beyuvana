"use client";

import React from "react";
import type { Product } from "@/app/data/productTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ProductFaqProps {
  product?: Product;
  productId?: number;
}

const ProductFaq = ({ product: productProp, productId }: ProductFaqProps) => {
  const faqData = productProp?.customFaq ?? [];
  const designType = productProp?.design_type ?? "GREEN";
  const colorsByDesign = {
    GREEN: {
      bgColor: "#E9F8EE",
      iconColor: "text-green-700",
      borderColor: "border-[#000]",
    },
    PINK: {
      bgColor: "#FFE7E7",
      iconColor: "text-red-700",
      borderColor: "border-[#000]",
    },
  } as const;

  const currentColors = colorsByDesign[designType];
  return (
    <div className="md:w-[80%] w-full mx-auto py-10">
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
            className="rounded-2xl px-6 py-4 border-0!"
            style={{ backgroundColor: currentColors.bgColor }}
          >
            <AccordionTrigger
              className={cn(
                "flex items-center justify-between w-full group text-left pr-0 hover:cursor-pointer transition-colors duration-300 no-underline hover:no-underline",
                " [&[data-state=open]>div>span.icon]:before:content-['−']",
                " [&[data-state=closed]>div>span.icon]:before:content-['+']",
                " [&>svg]:hidden",
              )}
            >
              <div className="flex items-start gap-4 text-left md:w-auto w-[80%]">
                <span className="font-bold text-[#2D2D2D] md:text-[18px] text-[15px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="md:font-medium text-[#2D2D2D] md:text-[18px] text-[15px]">
                  {faq.question}
                </span>
              </div>

              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border",
                  currentColors.borderColor,
                )}
              >
                <span
                  className={cn(
                    "icon text-[18px] leading-none font-normal",
                    currentColors.iconColor,
                  )}
                />
              </div>
            </AccordionTrigger>

            <AccordionContent className="md:pl-10 pt-2 text-sm text-[#2D2D2D] md:text-[18px] text-[15px]">
              {faq.answer.map((ans, answerIndex) => (
                <p key={answerIndex} className="mb-1 text-[15px]">
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
