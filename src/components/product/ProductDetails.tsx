"use client"

import Image from "next/image"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
    id: string
    question: string
    answer: string[]
}

interface ProductDetailsProps {
    name: string
    tagline?: string
    description?: string
    certificateImg?: string
    faq?: FaqItem[]
    productId?: number
}

const ProductDetails = ({ name, tagline, description, certificateImg, faq, productId }: ProductDetailsProps) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-[Grafiels]">{name}</h1>

            {tagline && (
                <div>
                    <p className="text-sm text-gray-500 inline-flex border border-black rounded-[5px] py-2 px-2">
                        {tagline}
                    </p>
                </div>
            )}

            {description && <p className="text-sm text-gray-500">{description}</p>}

            {certificateImg && (
                <div className="flex items-center gap-2">
                    <Image src={certificateImg} alt="certificate" width={40} height={40} />
                    <p className="text-sm text-gray-500">View Lab Certificates</p>
                </div>
            )}

            {faq && faq.length > 0 && (
                <div className="w-full mx-auto">
                    <Accordion type="single" collapsible defaultValue={faq[0].id} className="space-y-3">
                        {faq.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger
                                    className="flex justify-between items-center text-[#0C4B33] px-5 py-3 hover:cursor-pointer transition-colors duration-300 no-underline hover:no-underline"
                                >
                                    <span
                                        className={`text-sm ${productId === 1 ? "text-red-500" : "text-blue-500"
                                            }`}
                                    >
                                        {item.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-black px-5 py-4 font-light">
                                    {item.answer.map((ans, index) => (
                                        <p key={index} className="mb-1">{ans}</p>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    )
}

export default ProductDetails