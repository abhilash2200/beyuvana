"use client"

import Image from "next/image"
import ImageGalleryDialog from "@/components/ui/ImageGalleryDialog"
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
    description?: string[]
    certificateImg?: string
    certificateImages?: string[]
    faq?: FaqItem[]
    productId?: number
}

const ProductDetails = ({ name, tagline, description, certificateImg, certificateImages, faq, productId }: ProductDetailsProps) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="md:text-2xl text-xl leading-tight font-[Grafiels]">{name}</h1>

            {tagline && (
                <div>
                    <p className="text-sm text-gray-500 inline-flex border border-black rounded-[5px] py-2 px-2">
                        {tagline}
                    </p>
                </div>
            )}

            {description && description.map((item, index) => (
                <p key={index} className="text-sm text-gray-500">{item}</p>
            ))}

            {certificateImg && (
                <ImageGalleryDialog
                    images={certificateImages ?? (certificateImg ? [certificateImg] : [])}
                    title="Lab Certificates"
                    trigger={
                        <button type="button" className="flex items-center gap-2 group hover:cursor-pointer hover:no-underline">
                            <Image src={certificateImg} alt="certificate" width={40} height={40} className="w-auto h-auto" />
                            <p className="text-sm text-gray-500 group-hover:underline">View Lab Certificates</p>
                        </button>
                    }
                />
            )}

            {faq && faq.length > 0 && (
                <div className="w-full mx-auto">
                    <Accordion type="single" collapsible className="space-y-3">
                        {faq.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger
                                    className="flex justify-between items-center text-[#0C4B33] md:px-5 px-0 py-3 hover:cursor-pointer transition-colors duration-300 no-underline hover:no-underline"
                                >
                                    <span
                                        className={`text-sm ${productId === 1 ? "text-[#0C4B33]" : "text-[#FF4646]"
                                            }`}
                                    >
                                        {item.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-black md:px-5 px-0 py-4 font-light">
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