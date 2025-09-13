"use client";

import React from "react";
import Image from "next/image";

interface ContentItem {
    title: string;
    text: string;
}

const leftContent: ContentItem[] = [
    {
        title: "Plant-Powered Formulations",
        text: "Developed with carefully selected botanicals, vitamins, and adaptogens.",
    },
    {
        title: "Science-Inspired",
        text: "Created using ingredients that are supported by nutritional research.",
    },
    {
        title: "Clean & Transparent",
        text: "100% vegetarian, with no added sugar, no harmful chemicals, and no hidden additives.",
    },
];

const rightContent: ContentItem[] = [
    {
        title: "Holistic Approach",
        text: "Designed to support overall wellness, balance, and daily vitality.",
    },
    {
        title: "Trusted Quality",
        text: "Every batch is lab-tested for safety and purity before it reaches you.",
    },
    {
        title: "Commitment to Integrity",
        text: "Honest, clear, and mindful formulations made with your long-term well-being in mind.",
    },
];

interface FloatingImage {
    src: string;
    alt: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

const floatingImages: FloatingImage[] = [
    { src: "/assets/img/hand.png", alt: "hand", top: "5%", left: "-30px" },
    { src: "/assets/img/bulb.png", alt: "bulb", top: "40%", left: "-30px" },
    { src: "/assets/img/star.png", alt: "star", bottom: "5%", left: "-30px" },
    { src: "/assets/img/lotus.png", alt: "lotus", top: "5%", right: "-30px" },
    { src: "/assets/img/tick.png", alt: "tick", top: "40%", right: "-30px" },
    { src: "/assets/img/bowl.png", alt: "bowl", bottom: "5%", right: "-30px" },
];

const Choose: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-between items-center gap-6 md:gap-0">
            <div className="w-full md:w-[32%] pr-6 md:pr-10 flex flex-col items-end text-right space-y-6 gap-y-8">
                {leftContent.map((item, idx) => (
                    <div key={idx} className="max-w-[20vw]">
                        <h2 className="text-[#1A2819] font-[Grafiels] text-[1.1rem] md:text-[1.2vw] mb-1">
                            {item.title}
                        </h2>
                        <p className="text-[#3B3B3B] font-light leading-tight">{item.text}</p>
                    </div>
                ))}
            </div>

            <div className="w-full md:w-[32%] flex justify-center relative">
                {floatingImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="absolute z-10 transition-transform duration-300 hover:scale-110"
                        style={{
                            top: img.top,
                            bottom: img.bottom,
                            left: img.left,
                            right: img.right,
                        }}
                    >
                        <Image src={img.src} width={80} height={80} alt={img.alt} />
                    </div>
                ))}

                <div className="relative w-[350px] md:w-[450px] h-[300px] md:h-[400px] overflow-hidden rounded-[30px] shadow-lg">
                    <video
                        src="/assets/videos/Sqaure-video.mov"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="w-full md:w-[32%] pl-6 md:pl-10 flex flex-col items-start text-left space-y-6 gap-y-8">
                {rightContent.map((item, idx) => (
                    <div key={idx} className="max-w-[20vw]">
                        <h2 className="text-[#1A2819] font-[Grafiels] text-[1.1rem] md:text-[1.2vw] mb-1">
                            {item.title}
                        </h2>
                        <p className="text-[#3B3B3B] font-light leading-tight">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Choose;
