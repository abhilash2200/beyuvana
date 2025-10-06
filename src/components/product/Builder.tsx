"use client"

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { Product } from "@/app/data/fallbackProducts"

const Builder = ({ product }: { product: Product }) => {
  // Use builder array for slides
  const slides = product?.builder || []

  return (
    <div className="py-8">
      <Splide
        options={{
          type: "loop",
          perPage: 2,
          autoplay: true,
          interval: 4000,
          padding: "1rem",
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
          pauseOnHover: true,
          arrows: false,
          pagination: false,
          gap: "1rem",
        }}
      >
        {slides.map((item) => (
          <SplideSlide key={item.id}>
            <div className="flex flex-wrap rounded-[20px] overflow-hidden">
              <div className="w-full md:w-[40%]">
                <Image
                  src={item.img}
                  width={334}
                  height={180}
                  alt={item.title}
                  className="w-full h-[180px] object-cover"
                />
              </div>
              <div
                className="w-full md:w-[60%] p-6 flex flex-col justify-center"
                style={{ backgroundColor: item.bgColor }}
              >
                <h2
                  className="text-[20px] font-[Grafiels] leading-tight mb-3"
                  style={{ color: item.headingColor }}
                >
                  {item.title}
                </h2>
                <p style={{ color: item.paraColor }}>{item.desc}</p>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Builder;
