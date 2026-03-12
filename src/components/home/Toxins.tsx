"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";

interface ToxinItem {
  img: string;
  text: string;
}

const toxinItems: ToxinItem[] = [
  { img: "/assets/img/heavy.png", text: "Heavy Metals\nTested" },
  { img: "/assets/img/aflatoxins.png", text: "Aflatoxins\nTested" },
  { img: "/assets/img/food.png", text: "Food Microbiology\nTested" },
  { img: "/assets/img/gmo.png", text: "NON-\nGMO" },
  { img: "/assets/img/no.png", text: "NO\nGelatin" },
  { img: "/assets/img/lab.png", text: "Lab-Tested\nFormula" },
  { img: "/assets/img/clinically.png", text: "Clinically Researched\nActives" },
  { img: "/assets/img/gmp.png", text: "GMP Certified\nManufacturing" },
  { img: "/assets/img/fssai.png", text: "FSSAI\nApproved" },
  { img: "/assets/img/vegetarian.png", text: "100% Vegetarian" },
];

const Toxins = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 1; // pixels per tick
    const interval = setInterval(() => {
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += speed;
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="toxins-slider w-full overflow-x-auto"
    >
      <div className="flex min-w-max gap-x-8">
        {toxinItems.map((item, index) => (
          <div
            key={index}
            className={`flex gap-x-3 items-center justify-center px-6 md:text-[18px] text-[16px] ${
              index !== toxinItems.length - 1 ? "border-r border-white" : ""
            }`}
          >
            <Image
              src={item.img}
              width={70}
              height={70}
              alt={item.text}
              className="md:w-[70px] w-[50px]"
            />
            <p className="whitespace-pre-line text-[#FFF] text-left text-[14px] md:text-[18px] leading-tight">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toxins;