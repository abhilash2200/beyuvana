"use client";

import Image from "next/image";
import React from "react";
import { Plus } from "lucide-react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

interface WhyNeedItem {
  img: string;
  title1: string;
  title2: string;
  desc: string;
}

const items: WhyNeedItem[] = [
  {
    img: "/assets/img/lysine.png",
    title1: "L-Lysine",
    title2: "L-Proline",
    desc: "Core collagen \namino acids",
  },
  {
    img: "/assets/img/amla.png",
    title1: "Amla",
    title2: "Vitamin C",
    desc: "Essential for \ncollagen synthesis",
  },
  {
    img: "/assets/img/bambo.png",
    title1: "Bamboo Silica",
    title2: "Glutathione",
    desc: "Natural \nantioxidants",
  },
  {
    img: "/assets/img/biotin.png",
    title1: "Biotin",
    title2: "Hyaluronic Acid",
    desc: "Bone health \nsupport",
  },
  {
    img: "/assets/img/gotu.png",
    title1: "Ashwagandha",
    title2: "Gotu Kola",
    desc: "Minerals for \nconnective tissue",
  },
];

const WhyNeed: React.FC = () => {
  return (
    <div className="w-full md:pt-10 pt-6">
      <Splide
        aria-label="Why Need Slider"
        options={{
          perPage: 5,
          gap: "2rem",
          padding: { left: "4rem", right: "4rem" },
          autoplay: true,
          interval: 4000,
          pauseOnHover: true,
          arrows: false,
          pagination: false,
          breakpoints: {
            1024: { perPage: 2, gap: "1rem", padding: { left: "2rem", right: "2rem" } },
            640: { perPage: 2, gap: "1rem", padding: { left: "1rem", right: "1rem" }, pagination: true },
          },
          classes: {
            pagination: "splide__pagination testpagination",
            page: "splide__pagination__page testpage",
          },
        }}
      >
        {items.map((item, idx) => (
          <SplideSlide key={idx}>
            <div className="relative flex justify-center">
              <Image
                src={item.img}
                width={270}
                height={650}
                alt={item.title1}
                className="rounded-lg object-contain md:w-full md:h-full w-[150px] h-auto"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2">
                <h2 className="font-[Grafiels] text-[18px] md:text-[28px] leading-tight">
                  {item.title1}
                </h2>
                <Plus className="w-8 h-8 my-1 sm:w-6 sm:h-6 xs:w-5 xs:h-5" strokeWidth={0.85} />
                <h2 className="font-[Grafiels] text-[18px] md:text-[28px] leading-tight">
                  {item.title2}
                </h2>

                <hr className="w-20 sm:w-16 xs:w-12 my-2 border-white" />
                <p className="text-[14px] sm:text-[12px] xs:text-[11px] tracking-wide font-light whitespace-pre-line leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default WhyNeed;
