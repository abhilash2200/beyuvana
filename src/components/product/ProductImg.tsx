"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Lens } from "@/components/ui/lens";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImgProps {
  images: string[];
}

export default function ProductImg({ images }: ProductImgProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const splideRef = useRef<{ splide: { go: (direction: string | number) => void; index: number } } | null>(null);

  return (
    <div className="w-full mx-auto flex flex-col items-center space-y-6">
      {/* Main Product Image with Lens */}
      <div className="w-full flex items-center justify-center">
        <Lens>
          <Image
            src={images[selectedIndex]}
            alt="Product Image"
            width={600}
            height={600}
            className="object-contain w-full h-full rounded-xl overflow-hidden shadow-lg"
            priority
          />
        </Lens>
      </div>

      {/* Thumbnail Slider with custom arrows */}
      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={() => {
            const splide = splideRef.current?.splide;
            if (!splide) return;

            splide.go("<");
            setSelectedIndex(splide.index);
          }}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-green-500 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slider */}
        <Splide
          options={{
            perPage: 3,
            gap: "1rem",
            pagination: false,
            arrows: false,
            rewind: true,
            breakpoints: {
              640: { perPage: 3 },
              480: { perPage: 2 },
            },
          }}
          ref={splideRef}
          onMoved={(_splide: unknown, newIndex: number) => {
            setSelectedIndex(newIndex);
          }}
          className="w-full"
        >
          {images.map((img, idx) => (
            <SplideSlide key={idx}>
              <button
                onClick={() => {
                  setSelectedIndex(idx);
                  splideRef.current?.splide?.go(idx);
                }}
                className={`p-2 rounded-xl border transition ${
                  selectedIndex === idx ? "border-green-500 shadow-md" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={120}
                  height={120}
                  className="object-contain rounded-lg"
                />
              </button>
            </SplideSlide>
          ))}
        </Splide>

        {/* Right Arrow */}
        <button
          onClick={() => {
            const splide = splideRef.current?.splide;
            if (!splide) return;

            splide.go(">");
            setSelectedIndex(splide.index);
          }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-green-500 hover:text-white transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
