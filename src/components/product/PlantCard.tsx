"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

interface PlantCardProps {
    title: string;
    description: string;
    img: string;
    bgColor: string;
    headingColor: string;
    paragraphColor: string;
    plusColor: string;
    xColor: string;
}

const PlantCard = ({ title, description, img, bgColor, headingColor, paragraphColor, plusColor, xColor }: PlantCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const isGif = img.toLowerCase().endsWith(".gif");

    return (
        <div
            className={`relative w-full max-w-[450px] h-[500px] rounded-[20px] 
        shadow-md flex flex-col items-center justify-center 
        transition-all duration-500 overflow-hidden`}
            style={{ backgroundColor: expanded ? "white" : bgColor }}
        >
            {expanded ? (
                // Expanded View
                <div className="flex flex-col items-center gap-y-4 text-center border border-gray-900 rounded-[20px] p-4 w-full h-full">
                    <div className="w-48 h-48 rounded-full overflow-hidden border">
                        <Image
                            src={img}
                            alt={title}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                            unoptimized={isGif}
                        />
                    </div>
                    <h3
                        className="mt-4 font-[Grafiels] text-[25px]"
                        style={{ color: headingColor }}
                    >
                        {title}
                    </h3>
                    <div
                        className="h-[1px] w-[90%] mx-auto"
                        style={{ backgroundColor: headingColor }}
                    ></div>
                    <p
                        className="mt-2 text-[16px] max-w-[90%] mx-auto"
                        style={{ color: paragraphColor }}
                    >
                        {description}
                    </p>

                    <button
                        onClick={() => setExpanded(false)}
                        className="mt-4 w-12 h-12 flex items-center justify-center rounded-full transition cursor-pointer"
                        style={{ backgroundColor: headingColor }}
                    >
                        <X size={24} style={{ color: xColor }} />
                    </button>
                </div>
            ) : (
                // Default View
                <div className="relative w-full h-full">
                    <div className="h-full w-full bg-[#000]/50 absolute top-0 left-0 overflow-hidden z-20"></div>
                    <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover rounded-xl"
                        unoptimized={isGif}
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-30 text-center">
                        <h3 className="text-[#FFFFFF] font-[Grafiels] text-[25px]">{title}</h3>
                    </div>
                    <button
                        onClick={() => setExpanded(true)}
                        className="absolute z-30 bottom-[20px] left-[50%] translate-x-[-50%] w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:scale-110 transition cursor-pointer"
                    >
                        <Plus size={24} style={{ color: plusColor }} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlantCard;
