"use client"

import Image from "next/image"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import { useParams } from "next/navigation"
import { Product, fallbackProducts, Compare as CompareItem } from "@/app/data/fallbackProducts"

interface CompareProps {
    product?: Product
}

const Compare = ({ product }: CompareProps) => {
    const params = useParams()
    const routeId = typeof params?.id === "string" ? params.id : undefined
    const resolvedProduct: Product | undefined = product ? product : fallbackProducts.find(p => p.id.toString() === routeId)
    const slides: CompareItem[] = resolvedProduct?.compare || []

    // Use first slide colors as container defaults; each slide sets its own as well
    const containerBg = slides[0]?.bgColor || "#122014"
    const containerHeading = slides[0]?.headingColor || "#FFFFFF"
    const containerPara = slides[0]?.paraColor || "#FFFFFF"

    return (
        <div
            className="relative rounded-[20px] px-6 py-10 md:pb-20 pb-10 flex flex-col items-center justify-center gap-y-2 overflow-hidden"
            style={{ backgroundColor: containerBg }}
        >
            <div className="absolute bottom-0 right-0 pointer-events-none">
                <Image
                    src="/assets/img/product-details/deco-compare.png"
                    width={115}
                    height={395}
                    alt="Decoration"
                    className="w-full h-auto"
                />
            </div>

            <Splide
                options={{
                    type: "loop",
                    perPage: 1,
                    autoplay: true,
                    interval: 4000,
                    gap: "1rem",
                    arrows: true,
                    pagination: false,
                    classes: {
                        arrows: "splide__arrows comparearrow",
                        arrow: "splide__arrow comparearrow-btn",
                        next: "splide__arrow--next comparearrow-next",
                        prev: "splide__arrow--prev comparearrow-prev",
                    },
                }}
                className="w-full"
            >
                {slides.map(slide => (
                    <SplideSlide key={slide.id}>
                        <div className="flex flex-col items-center text-left">
                            <Image
                                src={slide.img}
                                width={778}
                                height={339}
                                alt={`Compare Image ${slide.id}`}
                                className="w-full h-auto"
                            />
                            <div className="py-6">
                                <h2 className="font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-4" style={{ color: slide.headingColor || containerHeading }}>
                                    {slide.title}
                                </h2>
                                <p className="mb-4 text-[15px] font-light" style={{ color: slide.paraColor || containerPara }}>{slide.desc}</p>
                                <hr style={{ color: slide.paraColor || containerPara }} />
                            </div>
                        </div>
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    )
}

export default Compare
