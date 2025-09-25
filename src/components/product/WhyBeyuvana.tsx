"use client";

import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { WhyItem as WhyItemType, Product, fallbackProducts } from "@/app/data/fallbackProducts";
import { useParams } from "next/navigation";

interface WhyBeyuvanaProps {
  product?: Product;
}

const WhyBeyuvana = ({ product }: WhyBeyuvanaProps) => {
  const params = useParams();
  const routeId = typeof params?.id === "string" ? params.id : undefined;
  const resolvedProduct: Product | undefined = product
    ? product
    : fallbackProducts.find((p) => p.id.toString() === routeId);
  const items: WhyItemType[] = resolvedProduct?.whyItems || [];
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="py-10">
      <Splide
        options={{
          perPage: 3,
          gap: "1rem",
          arrows: false,
          pagination: true,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
      >
        {items.map((item) => {
          const isHovered = hoveredId === item.id;

          // Background & text colors
          const bgColor = isHovered ? item.hoverBgColor : item.bgColor;
          const headingColor = isHovered ? item.hoverHeadingColor : item.headingColor;
          const paraColor = isHovered ? item.hoverParaColor : item.paraColor;

          // Image color based on product type
          let imgFilter = "none";
          if (isHovered) {
            if (item.bgColor === "#FFD2D2") {
              // Red product → red image
              imgFilter = "invert(24%) sepia(95%) saturate(7490%) hue-rotate(354deg) brightness(101%) contrast(107%)";
            } else if (item.bgColor === "#D5EDD9") {
              // Green product → green image
              imgFilter = "invert(42%) sepia(28%) saturate(2362%) hue-rotate(83deg) brightness(93%) contrast(92%)";
            }
          }

          return (
            <SplideSlide key={item.id}>
              <div
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group rounded-[20px] h-[350px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300"
                style={{ backgroundColor: bgColor }}
              >
                <div
                  className="rounded-full p-3 mb-2 transition-all duration-300"
                  style={{ backgroundColor: isHovered ? "#FFFFFF" : "transparent" }}
                >
                  <Image
                    src={item.img}
                    width={60}
                    height={60}
                    alt={item.title}
                    style={{
                      filter: imgFilter,
                      transition: "filter 0.3s",
                    }}
                  />
                </div>

                <h3
                  className="text-[22px] font-normal leading-tight font-[Grafiels] mb-2 whitespace-pre-line transition-colors duration-300"
                  style={{ color: headingColor }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-light max-w-[80%] transition-colors duration-300"
                  style={{ color: paraColor }}
                >
                  {item.desc}
                </p>
              </div>
            </SplideSlide>
          );
        })}
      </Splide>
    </div>
  );
};

export default WhyBeyuvana;
