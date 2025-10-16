"use client"

import { Compare } from "../ui/compare"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

const CompareProduct = () => {
  const leftContent = {
    title: "BEYUVANA™ Glow Essence",
    points: [
      "Uses 4X Liposomal Glutathione + Liposomal Vitamin C for enhanced absorption & deeper skin brightening ",
      "Contains 18 clinically-backed synergistic actives for glow, acne, hydration, pigmentation & gut health ",
      "Delivered in delicious 8g daily sachets with natural flavors—improves routine consistency & absorption ",
      "Rich in powerful antioxidants like Grape Seed Extract, Astaxanthin, Green Tea, and Pomegranate",
      "Includes gut-skin axis support with Glutathione, Green Tea, and Pomegranate for holistic skin repair ",
      "Powered by Ayurvedic adaptogens (Ashwagandha, Gotu Kola, Shatavari) for stress & hormonal balance ",
      "Fuses modern science (Glutathione, HA, Zinc) with Ayurvedic wisdom for deeper rejuvenation",
      "Tailored for Indian skin needs using botanicals like Amla, Licorice, Ashwagandha",
      "Shows visible skin radiance from Week 3, with deep cellular improvements by Week 10",
      "Treats skin issues from within (inside-out approach) unlike serums that only act on the outer skin layer ",
    ],
    icon: <FaCheckCircle className="text-green-600 mr-2 inline" />,
  }

  const rightContent = {
    title: "Typical Market Skin Products",
    points: [
      "Uses regular glutathione with poor absorption and minimal visible results",
      "Limited to 5–8 basic actives focused only on superficial glow",
      "Capsules/tablets often have poor compliance due to taste and digestion issues ",
      "Lacks antioxidant synergy or uses synthetic alternatives",
      "Ignores gut health, focusing only on temporary surface-level appearance",
      "Offers no internal support for stress or hormone-related skin concerns ",
      "One-sided: either synthetic chemicals or limited herbs—not an integrated blend",
      "Generic international formulas often not suited to Indian skin or climate",
      "Slower or inconsistent results due to weaker ingredients and lower bioactivity",
      "Serums provide surface-level glow without correcting internal skin dysfunction",
    ],
    icon: <FaTimesCircle className="text-red-600 mr-2 inline" />,
  }

  return (
    <div className="bg-[#FFF6F6] md:p-8 p-4 rounded-[20px]">
      <div className="flex flex-wrap justify-between gap-y-10">
        {/* Left content */}
        <div className="w-full md:w-[30%]">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-4">{leftContent.title}</h2>
          {leftContent.points.map((point, i) => (
            <p key={i} className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-tight mb-4 md:w-[80%] w-full">
              {leftContent.icon}
              {point}
            </p>
          ))}
        </div>

        {/* Middle Compare Image */}
        <div className="w-full md:w-[40%] flex items-center">
          <Compare
            firstImage="/assets/img/product-details/before-age.png"
            secondImage="/assets/img/product-details/after-age.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full"
            slideMode="hover"
          />
        </div>

        {/* Right content */}
        <div className="w-full md:w-[30%]">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-4">{rightContent.title}</h2>
          {rightContent.points.map((point, i) => (
            <p key={i} className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-tight mb-4 md:w-[80%] w-full">
              {rightContent.icon}
              {point}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompareProduct