"use client"

import Image from "next/image"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"

interface CompareSlide {
    id: number
    img: string
    title: string
    desc: string
}

const slides: CompareSlide[] = [
    {
        id: 1,
        img: "/assets/img/product-details/compare-11.png",
        title: "Lines that used to stay... started to fade.",
        desc: "I noticed the difference by week 4. My skin felt tighter, especially around the eyes and mouth. Now, even without makeup, the fine lines are visibly reduced."
    },
    {
        id: 2,
        img: "/assets/img/product-details/compare-11.png",
        title: "Skin feels smoother & brighter",
        desc: "After consistent use, my complexion looks healthier and more radiant. Even my friends started noticing the glow."
    },
    {
        id: 3,
        img: "/assets/img/product-details/compare-11.png",
        title: "Visible improvement in elasticity",
        desc: "By week 8, my skin felt more elastic and firm. Fine lines and sagging areas visibly reduced, giving a youthful look."
    }
]

const Compare = () => {
    return (
        <div className="relative bg-[#122014] rounded-[20px] px-6 py-10 pb-20 flex flex-col items-center justify-center gap-y-2 overflow-hidden">
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
                    autoplay: true,
                    interval: 4000,
                    perPage: 1,
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
                                <h2 className="text-[#FFF] font-[Grafiels] text-[25px] mb-4">
                                    {slide.title}
                                </h2>
                                <p className="text-[#FFF] mb-4">{slide.desc}</p>
                                <hr className="text-[white]" />
                            </div>
                        </div>
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    )
}

export default Compare
