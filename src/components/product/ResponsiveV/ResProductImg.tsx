import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import Image from 'next/image'

const ResProductImg = ({ images }: { images: string[] }) => {
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
            <SplideSlide key={idx}>
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