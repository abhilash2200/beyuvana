"use client";

import Image from "next/image";
import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

interface ToxinItem {
  img: string;
  text: string;
}

const toxinItems: ToxinItem[] = [
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Filters\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Filters\nor chemicals" },
  { img: "/assets/img/non-toxic.png", text: "No Toxins\nor chemicals" },
];

const Toxins: React.FC = () => {
  return (
    <div className="toxins-slider">
      <Splide
        options={{
          type: "loop",
          perPage: 5,
          gap: "1rem",
          pagination: false,
          arrows: false,
          autoplay: true,
          interval: 2500,
          pauseOnHover: false,
          breakpoints: {
            1280: { perPage: 4 },
            1024: { perPage: 3 },
            768: { perPage: 2 },
            480: { perPage: 2 },
          },
        }}
      >
        {toxinItems.map((item, index) => (
          <SplideSlide key={index}>
            <div
              className={`flex gap-x-2 items-center justify-center md:text-[18px] text-[16px] ${
                index !== toxinItems.length - 1 ? "border-r border-white" : ""
              }`}
            >
              <Image src={item.img} width={70} height={70} alt={item.text} className="md:w-[70px] w-[50px]" />
              <p className="whitespace-pre-line text-[#FFF] text-center text-[14px] md:text-[18px] leading-tight">
                {item.text}
              </p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Toxins;
