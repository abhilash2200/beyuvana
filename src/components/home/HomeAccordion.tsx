"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FC } from "react"

interface FaqItem {
    id: string
    question: string
    answer: string
}

const faqData: FaqItem[] = [
    {
        id: "item-1",
        question: "What is BEVUVANA™?",
        answer:
            "BEVUVANA™ is a premium wellness brand offering plant-powered, science-backed formulations. Each product is carefully crafted with clinically researched nutrients, botanicals, and adaptogens that support skin radiance, collagen health, gut balance, and overall well-being—naturally and safely.",
    },
    {
        id: "item-2",
        question: "Are BEVUVANA™ products vegetarian?",
        answer: "Yes, all BEVUVANA™ products are vegetarian.",
    },
    {
        id: "item-3",
        question: "Are your products safe?",
        answer: "Yes, they are formulated with high safety standards using clinically tested ingredients.",
    },
    {
        id: "item-4",
        question: "Why is BEVUVANA™ better than serums or capsules?",
        answer:
            "BEVUVANA™ formulations provide holistic support beyond single-use serums or capsules, targeting multiple aspects of wellness at once.",
    },
]

const HomeAccordion: FC = () => {
    return (
        <div className="w-full md:max-w-[80%] mx-auto">
            <Accordion type="single" collapsible defaultValue="item-1" className="space-y-3">
                {faqData.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger
                            className="flex justify-between items-center bg-[#1F1F1F] text-white px-5 py-3 hover:bg-black hover:cursor-pointer transition-colors duration-300 no-underline hover:no-underline"
                        >
                            <span>{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-50 text-gray-800 px-5 py-4">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default HomeAccordion
