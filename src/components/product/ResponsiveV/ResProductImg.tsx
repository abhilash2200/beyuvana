import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import Image from 'next/image'
import { fallbackProducts } from "@/app/data/fallbackProducts"

interface ResProductImgProps {
  images?: string[]; // Optional, will be ignored - using fallback data instead
  designType?: "GREEN" | "PINK"; // Design type to find correct product
}

const ResProductImg = ({ designType }: ResProductImgProps) => {
  // Get images ONLY from fallbackProducts.ts based on design type
  const localProduct = fallbackProducts.find((p) => p.design_type === designType);
  const images = localProduct?.images || [];

  return (
    <div className='pb-10'>
      <Splide
        options={{
          perPage: 1,
          perMove: 1,
          gap: "1rem",
          pagination: true,
          arrows: false,
          rewind: true,
          classes: {
            pagination: "splide__pagination respagination",
            page: "splide__pagination__page respage",
          },
        }}
        className="w-full"
      >
        {images.map((img, idx) => (
          <SplideSlide key={idx} className="flex justify-center items-center">
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              width={350}
              height={350}
              className="object-contain rounded-lg"
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}

export default ResProductImg