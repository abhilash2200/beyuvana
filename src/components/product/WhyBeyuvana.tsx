"use client"

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

interface WhyItem {
  id: number;
  img: string;
  title: string;
  desc: string;
}

const WhyBeyuvana = () => {
  const items: WhyItem[] = [
    {
      id: 1,
      img: "/assets/img/product-details/avtar.png",
      title: "Stimulates Natural\nCollagen Production",
      desc: "Unlike animal collagen powders that simply supply broken peptides, BEYUVANA™ uses amino acids (L-Lysine, L-Proline), Vitamin C, and bamboo silica to naturally boost your body’s own collagen-building process — from within.",
    },
    {
      id: 2,
      img: "/assets/img/product-details/avtar.png",
      title: "Deep Hydration &\nSkin Barrier Repair",
      desc: "With Hyaluronic Acid and Amla the formula restores moisture balance, plumps the skin, and strengthens the barrier — essential for smooth, youthful skin.",
    },
    {
      id: 3,
      img: "/assets/img/product-details/avtar.png",
      title: "Brightens Skin &\nFades Pigmentation",
      desc: "Clinically studied actives like Glutathione, Licorice, and Grape Seed Extract gently reduce oxidative stress and pigmentation, giving your skin a radiant glow.",
    },
  ];

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
          classes: {
            pagination: "splide__pagination testpagination",
            page: "splide__pagination__page testpage",
          },
        }}
      >
        {items.map((item) => (
          <SplideSlide key={item.id}>
            <div className="group bg-[#F8FFF9] rounded-[20px] h-[350px] flex flex-col items-center justify-center p-6 text-center hover:shadow-lg hover:bg-[#0C4B33] cursor-pointer transition-colors duration-300">
              <Image
                src={item.img}
                width={99}
                height={99}
                alt={item.title}
                className="mb-2 rounded-full"
              />
              <h3 className="text-[22px] font-normal leading-tight font-[Grafiels] mb-2 whitespace-pre-line text-[#0C4B33] group-hover:text-white">
                {item.title}
              </h3>
              <p className="text-[#000] group-hover:text-white font-light max-w-[80%]">{item.desc}</p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default WhyBeyuvana;
