"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Product } from "@/app/data/fallbackProducts";
import { useState } from "react";

const Action = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  if (!product || !product.actionItems) return null;

  return (
    <div className="w-full">
      <Splide
        options={{
          perPage: 3,
          perMove: 1,
          gap: "1rem",
          arrows: false,
          pagination: false,
          rewind: true,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
        aria-label="Action Slider"
      >
        {product.actionItems.map((item) => {
          const isHovered = hovered === item.id;
          return (
            <SplideSlide key={item.id}>
              <div
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="group rounded-[20px] h-[320px] md:px-6 px-4 md:py-10 py-5 cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: isHovered ? item.hoverBgColor : item.bgColor,
                }}
              >
                <h2
                  className="font-[Grafiels] text-[22px] leading-tight mb-3 transition-colors duration-300"
                  style={{
                    color: isHovered ? item.hoverHeadingColor : item.headingColor,
                  }}
                >
                  {item.title}
                </h2>
                <p
                  className="text-[15px] transition-colors duration-300"
                  style={{
                    color: isHovered ? item.hoverParagraphColor : item.paragraphColor,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </SplideSlide>
          );
        })}
      </Splide>
    </div>
  );
};

export default Action;
