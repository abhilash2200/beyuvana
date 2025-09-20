"use client";

import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Star } from "lucide-react";
import { useState } from "react";

interface TestimonialItem {
  name: string;
  img: string;
  productimg: string;
  text: string;
  dec: string;
  rating?: number;
}

const testimonials: TestimonialItem[] = [
  {
    name: "Ramesh Kumar",
    img: "/assets/img/ramesh.png",
    text: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived. \nClean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productimg: "/assets/img/green-box.png",
    dec: "BEYUVANA™ Collagen Builder — India’s  1st Complete Plant-Based Premium",
    rating: 5,
  },
  {
    name: "Shivangi Dhar",
    img: "/assets/img/shivangi.png",
    text: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived. \nClean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productimg: "/assets/img/pink-box.png",
    dec: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    rating: 4,
  },
  {
    name: "Anjan Dutta",
    img: "/assets/img/anjan.png",
    text: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived. \nClean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productimg: "/assets/img/green-box.png",
    dec: "BEYUVANA™ Collagen Builder — India’s  1st  Complete Plant-Based Premium",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    img: "/assets/img/ramesh.png",
    text: "Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature. Just the right hint of sweetness, naturally derived. \nClean, light flavor powered by nature. Just the right hint of sweetness, naturally derived.",
    productimg: "/assets/img/pink-box.png",
    dec: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    rating: 4,
  },
];

const Testimonial: React.FC = () => {
  const defaultActive = 0;
  const [activeIndex, setActiveIndex] = useState<number>(defaultActive);

  return (
    <div className="w-full mx-auto relative">
      <Splide
        options={{
          type: "loop",
          perPage: 3,
          gap: "1rem",
          padding: { left: "1rem", right: "1rem" },
          autoplay: false,
          arrows: true,
          pagination: true,
          breakpoints: {
            1024: { perPage: 2, gap: "1rem", padding: { left: "2rem", right: "2rem" } },
            640: { perPage: 1, gap: "1rem", padding: { left: "1rem", right: "1rem" } },
          },
          classes: { arrows: "splide__arrows testarrow", arrow: "splide__arrow testarrow-btn", next: "splide__arrow--next testarrow-next", prev: "splide__arrow--prev testarrow-prev", pagination: "splide__pagination testpagination", page: "splide__pagination__page testpage", },
        }}
      >
        {testimonials.map((t, i) => (
          <SplideSlide key={i}>
            <div
              onMouseEnter={() => setActiveIndex(i)}
              className={`px-6 h-auto py-14 rounded-2xl text-left border transition-all duration-300 ease-out
                ${activeIndex === i
                  ? "border-black bg-white shadow-lg"
                  : "border-transparent bg-[#FFFDFD]"
                }`}
            >
              <div className="flex flex-wrap items-center gap-x-4 mb-6">
                <Image src={t.img} width={103} height={103} alt={t.name} />
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-[#2D2D2D] md:text-[30px] text-[25px] font-[Grafiels]">{t.name}</h3>
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={18}
                        fill={idx < (t.rating ?? 0) ? "gold" : "none"}
                        stroke="gold"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[#3B3B3B] font-light text-[16px] italic mb-6">
                {t.text.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-3 inline-block">{line}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-2 items-center md:px-4 px-0">
                <Image
                  src={t.productimg}
                  width={48}
                  height={65}
                  alt={t.name}
                  className="w-auto h-[65px]"
                />
                <p className="text-sm text-gray-500 max-w-[78%]">{t.dec}</p>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Testimonial;
