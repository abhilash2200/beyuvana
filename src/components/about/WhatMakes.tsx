"use client";

import React from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

interface FeatureItem {
    img: string;
    text: string;
}

const features: FeatureItem[] = [
    { img: "/assets/img/vegan1.png", text: "Plant\nBased Activities" },
    { img: "/assets/img/poison1.png", text: "No Animal\nProducts" },
    { img: "/assets/img/herbal-treatment.png", text: "Ayurvedic +\nModern Formulations" },
    { img: "/assets/img/insurance1.png", text: "Safe for Long-Term\nDaily Use" },
    { img: "/assets/img/ingredient1.png", text: "High-Quality\nIngredients Only" },
];

const WhatMakes = () => {
    return (
        <div className="pt-5">
            <Splide
                options={{
                    perPage: 5,
                    perMove: 1,
                    gap: "1rem",
                    pagination: true,
                    arrows: false,
                    breakpoints: {
                        1024: { perPage: 2 },
                        640: { perPage: 1 },
                    },
                }}
                classes={{
                    pagination: "splide__pagination testpagination",
                    page: "splide__pagination__page testpage",
                }}
            >
                {features.map((item, index) => (
                    <SplideSlide key={index}>
                        <div className="flex flex-col items-center justify-center px-4 md:py-15 py-10 rounded-[30px] border bg-white text-center shadow-sm hover:border-0 hover:bg-[#F0FFF9] hover:shadow-none transition-all duration-100 ease-out">
                            <Image
                                src={item.img}
                                alt={item.text}
                                width={60}
                                height={60}
                                className="mb-4"
                            />
                            <p className="text-gray-800 text-sm whitespace-pre-line font-medium">
                                {item.text}
                            </p>
                        </div>
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
};

export default WhatMakes;
