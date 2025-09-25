"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { fallbackProducts } from "@/app/data/fallbackProducts";
import { useParams } from "next/navigation";
import { useState } from "react";

const Action = () => {
  const { id } = useParams();
  const product = fallbackProducts.find((p) => p.id.toString() === id);
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
                className="group rounded-[20px] h-[250px] px-6 py-10 cursor-pointer transition-colors duration-300"
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
