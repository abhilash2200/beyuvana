"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

interface ActionItem {
  id: number;
  title: string;
  description: string;
}


const actionData: ActionItem[] = [
  {
    id: 1,
    title: "Youthful Skin Powered by Plants and Modern Science",
    description:
      "This transformation is powered by a synergy of botanicals, antioxidants, and Ayurvedic adaptogens — uniting nature and science for timeless, radiant skin.",
  },
  {
    id: 2,
    title: "11 Holistic Functions in Every Serving",
    description:
      "Collagen Boost from Within, Skin Hydration & Plumping, Brightens Skin Tone & Fades Pigmentation, Reduces Fine Lines & Wrinkles, Balances Stress-Aging & Hormones, UV & Pollution Defense, Anti-Inflammatory.",
  },
  {
    id: 3,
    title: "Formulated for Maximum Absorption",
    description:
      "Crafted with clinically backed, plant-based actives—absorbed deeply to deliver real, visible results from within. No added sugar, no shortcuts—just pure, purposeful nutrition your skin genuinely responds to.",
  },
];

const Action = () => {
  return (
    <div className="w-full">
      <Splide
        options={{
          perPage: 3,
          perMove: 1,
          gap: "1rem",
          arrows: false,
          autoplay: false,
          rewind: true,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
        aria-label="Action Slider"
      >
        {actionData.map((item) => (
          <SplideSlide key={item.id}>
            <div className="group bg-[#E2F9E5] rounded-[20px] px-6 py-10 hover:bg-[#0C4B33] cursor-pointer transition-colors duration-300">
              <h2 className="font-[Grafiels] text-[22px] text-[#0C4B33] leading-tight mb-3 group-hover:text-white transition-colors duration-300">
                {item.title}
              </h2>
              <p className="text-[15px] text-[#2B2B2B] group-hover:text-white transition-colors duration-300">
                {item.description}
              </p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Action;
