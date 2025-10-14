"use client";

import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { testimonialsData, type TestimonialData } from "@/app/data/testimonials";
import { StarRating } from "@/components/ui/StarRating";

// Configuration constants
const SLIDER_CONFIG = {
  type: "loop" as const,
  perPage: 3,
  gap: "1rem",
  padding: { left: "1rem", right: "1rem" },
  autoplay: false,
  arrows: true,
  pagination: true,
  breakpoints: {
    1024: {
      perPage: 2,
      gap: "1rem",
      padding: { left: "2rem", right: "2rem" },
    },
    640: {
      perPage: 1,
      gap: "1rem",
      padding: { left: "1px", right: "1px" },
      arrows: false,
    },
  },
  classes: {
    arrows: "splide__arrows testarrow",
    arrow: "splide__arrow testarrow-btn",
    next: "splide__arrow--next testarrow-next",
    prev: "splide__arrow--prev testarrow-prev",
    pagination: "splide__pagination testpagination",
    page: "splide__pagination__page testpage",
  },
} as const;

// Component constants
const CUSTOMER_IMAGE_SIZE = { width: 103, height: 103 };
const PRODUCT_IMAGE_SIZE = { width: 48, height: 65 };

/**
 * Customer header component displaying name, image, and rating
 */
const CustomerHeader: React.FC<{ testimonial: TestimonialData }> = ({ testimonial }) => (
  <div className="flex flex-wrap items-center gap-x-4 mb-6">
    <Image
      src={testimonial.customerImage}
      width={CUSTOMER_IMAGE_SIZE.width}
      height={CUSTOMER_IMAGE_SIZE.height}
      alt={testimonial.customerName}
      className="rounded-full"
    />
    <div className="flex flex-col gap-y-2">
      <h3 className="text-[#2D2D2D] md:text-[30px] text-[25px] font-[Grafiels]">
        {testimonial.customerName}
      </h3>
      <StarRating rating={testimonial.rating} />
    </div>
  </div>
);

/**
 * Testimonial text component with proper formatting
 */
const TestimonialText: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-[#3B3B3B] font-light text-[16px] italic mb-6">
    {text.split("\n").map((line, index) => (
      <p key={index} className="mb-3 inline-block">
        {line}
      </p>
    ))}
  </div>
);

/**
 * Product information component
 */
const ProductInfo: React.FC<{ testimonial: TestimonialData }> = ({ testimonial }) => (
  <div className="flex flex-wrap gap-x-2 items-center md:px-4 px-0">
    <Image
      src={testimonial.productImage}
      width={PRODUCT_IMAGE_SIZE.width}
      height={PRODUCT_IMAGE_SIZE.height}
      alt={`${testimonial.customerName}'s product`}
      className="w-auto h-[65px]"
    />
    <p className="text-sm text-gray-500 max-w-[78%]">
      {testimonial.productDescription}
    </p>
  </div>
);

/**
 * Individual testimonial card component
 */
const TestimonialCard: React.FC<{ testimonial: TestimonialData }> = ({ testimonial }) => (
  <div className="px-6 h-auto md:py-14 rounded-2xl text-left border border-transparent transition-all duration-300 ease-out hover:border-black hover:bg-white hover:shadow-lg">
    <CustomerHeader testimonial={testimonial} />
    <TestimonialText text={testimonial.testimonialText} />
    <ProductInfo testimonial={testimonial} />
  </div>
);

/**
 * Main Testimonial component with carousel functionality
 */
const Testimonial: React.FC = () => {
  return (
    <div className="w-full mx-auto relative">
      <Splide options={SLIDER_CONFIG}>
        {testimonialsData.map((testimonial) => (
          <SplideSlide key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Testimonial;
