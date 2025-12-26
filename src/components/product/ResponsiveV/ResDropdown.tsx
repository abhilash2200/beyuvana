"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CiCircleCheck } from "react-icons/ci";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import {
  fallbackProducts,
  TabItem,
  Product,
} from "@/app/data/fallbackProducts";

interface ResDropdownProps {
  productId?: number;
  product?: Product; // Accept product object directly
}

const ResDropdown = ({ productId, product: productProp }: ResDropdownProps) => {
  const [active, setActive] = useState<string>("");
  const splideRef = useRef<{
    splide: { go: (index: number) => void; index: number };
  } | null>(null);

  // Use product from props if provided, otherwise find by ID
  const product =
    productProp ||
    (productId ? fallbackProducts.find((p) => p.id === productId) : null);

  // Initialize active state with first item
  useEffect(() => {
    if (product?.tabItems && product.tabItems.length > 0 && !active) {
      setActive(product.tabItems[0].id);
    }
  }, [product, active]);

  if (!product || !product.tabItems || product.tabItems.length === 0) {
    return null; // Return null instead of error message for cleaner UI
  }

  const derivedBg = product.actionItems?.[0]?.bgColor || "#F8FFF9";
  const derivedHeading = product.actionItems?.[0]?.headingColor || "#017933";

  const tabItems: TabItem[] = product.tabItems.map(
    (t: TabItem, idx: number) => ({
      ...t,
      bgColor: t.bgColor ?? product.actionItems?.[idx]?.bgColor ?? derivedBg,
      headingColor:
        t.headingColor ??
        product.actionItems?.[idx]?.headingColor ??
        derivedHeading,
    }),
  );

  const selected = active
    ? tabItems.find((tab) => tab.id === active)
    : tabItems[0];

  const sliderOptions = {
    perPage: 3,
    gap: "0.5rem",
    arrows: false,
    pagination: false,
    keyboard: "global",
    rewind: true,
    autoplay: false,
    padding: { right: "1rem" },
    breakpoints: {
      640: { perPage: 2, gap: "0.5rem", padding: { right: "1rem" } },
      480: { perPage: 1, gap: "0.5rem", padding: { right: "1rem" } },
    },
  } as const;

  return (
    <div className="w-full pt-6 md:hidden">
      {/* Slider */}
      <div className="pr-4">
        <Splide
          options={sliderOptions}
          ref={splideRef}
          onMoved={(_splide: unknown, newIndex: number) => {
            if (tabItems[newIndex]) {
              setActive(tabItems[newIndex].id);
            }
          }}
        >
          {tabItems.map((tab) => {
            const isActive = active === tab.id;
            return (
              <SplideSlide key={tab.id} className="!w-auto">
                <button
                  onClick={() => {
                    setActive(tab.id);
                    // Move slider to this slide if needed
                    const index = tabItems.findIndex((t) => t.id === tab.id);
                    if (splideRef.current?.splide && index !== -1) {
                      splideRef.current.splide.go(index);
                    }
                  }}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-3 rounded-[10px] sm:rounded-[12px] transition-all duration-300 whitespace-nowrap ${isActive
                    ? "bg-gray-700 shadow-md"
                    : "bg-transparent hover:bg-gray-100"
                    }`}
                >
                  {/* Circular Icon Area */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${isActive ? "bg-white" : "bg-gray-200"
                      }`}
                  >
                    <Image
                      src={tab.icon}
                      alt={tab.label}
                      width={20}
                      height={20}
                      className="object-contain w-5 h-5 sm:w-6 sm:h-6"
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm sm:text-base font-medium ${isActive ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {tab.label}
                  </span>
                </button>
              </SplideSlide>
            );
          })}
        </Splide>
      </div>

      {/* Selected Content */}
      {selected && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="w-full flex items-center justify-center shadow-lg rounded-[20px]">
            <Image
              src={selected.img}
              alt={selected.label}
              width={420}
              height={320}
              className="rounded-[20px] object-contain"
            />
          </div>

          <div
            className="w-full shadow-lg rounded-[20px] p-6"
            style={{ backgroundColor: selected.bgColor }}
          >
            <div className="w-full">
              <CiCircleCheck
                className="w-8 h-8 mb-4"
                style={{ color: selected.headingColor }}
              />
              <p className="text-[15px]">{selected.description}</p>

              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                {selected.stats.map((stat, i) => (
                  <div key={i} className={`pr-2 ${i === 0 ? "border-r" : ""}`}>
                    <h2
                      className="text-[30px] font-[Grafiels] mb-2"
                      style={{ color: selected.headingColor }}
                    >
                      {stat.value}
                    </h2>
                    <p className="text-[16px] mb-2">{stat.description}</p>
                    <p className="text-[12px] text-gray-500">
                      Source: {stat.source}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4" />
              <div>
                <h2
                  className="text-[30px] font-[Grafiels] mb-2"
                  style={{ color: selected.headingColor }}
                >
                  {selected.extra.title}
                </h2>
                <p className="text-[16px] mb-2">{selected.extra.description}</p>
                <p className="text-[12px] text-gray-500">
                  Source: {selected.extra.source}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResDropdown;
