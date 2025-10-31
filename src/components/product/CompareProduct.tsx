"use client"

import Image from "next/image"
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa"

interface CompareProductProps {
  layoutType?: "pink" | "green"
}

const CompareProduct = ({ layoutType = "pink" }: CompareProductProps) => {
  const bgColor = layoutType === "pink" ? "#FFF6F6" : "#EBFCEE"
  const leftContent = {
    title: "BEYUVANA™ Glow Essence",
    points: [
      "Uses 4X Liposomal Glutathione + Liposomal Vitamin C for enhanced absorption & deeper skin brightening.",
      "Contains 18 clinically-backed synergistic actives for glow, acne, hydration, pigmentation & gut health.",
      "Delivered in delicious 8g daily sachets with natural flavors—improves routine consistency & absorption.",
      "Rich in powerful antioxidants like Grape Seed Extract, Astaxanthin, Green Tea, and Pomegranate.",
      "Includes gut-skin axis support with Glutathione, Green Tea, and Pomegranate for holistic skin repair.",
      "Powered by Ayurvedic adaptogens (Ashwagandha, Gotu Kola, Shatavari) for stress & hormonal balance.",
      "Fuses modern science (Glutathione, HA, Zinc) with Ayurvedic wisdom for deeper rejuvenation.",
      "Tailored for Indian skin needs using botanicals like Amla, Licorice, Ashwagandha.",
      "Shows visible skin radiance from Week 3, with deep cellular improvements by Week 10.",
      "Treats skin issues from within (inside-out approach) unlike serums that only act on the outer skin layer.",
    ],
    icon: <FaRegCheckCircle className="text-green-600" />,
  }

  const rightContent = {
    title: "Typical Market Skin Products",
    points: [
      "Uses regular glutathione with poor absorption and minimal visible results.",
      "Limited to 5–8 basic actives focused only on superficial glow.",
      "Capsules/tablets often have poor compliance due to taste and digestion issues.",
      "Lacks antioxidant synergy or uses synthetic alternatives.",
      "Ignores gut health, focusing only on temporary surface-level appearance.",
      "Offers no internal support for stress or hormone-related skin concerns.",
      "One-sided: either synthetic chemicals or limited herbs—not an integrated blend.",
      "Generic international formulas often not suited to Indian skin or climate.",
      "Slower or inconsistent results due to weaker ingredients and lower bioactivity.",
      "Serums provide surface-level glow without correcting internal skin dysfunction.",
    ],
    icon: <FaRegTimesCircle className="text-red-600" />,
  }

  return (
    <div className="md:p-8 p-4 rounded-[20px] shadow-sm" style={{ backgroundColor: bgColor }}>
      <div className="flex flex-wrap justify-between gap-y-10 md:gap-y-8">
        {/* Left content */}
        <div className="w-full md:w-[33%] md:pr-4">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-6 md:mb-5">{leftContent.title}</h2>
          <div className="space-y-3 md:space-y-2.5">
            {leftContent.points.map((point, i) => (
              <p key={i} className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-relaxed md:leading-normal mb-2 last:mb-0 md:w-[85%] w-full flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">{leftContent.icon}</span>
                <span>{point}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Middle Compare Image */}
        <div className="w-full md:w-[33%] relative flex items-center justify-center md:my-4">
          <div className="flex items-center justify-center w-full md:w-auto">
            <div className="bg-white w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full flex items-center justify-center relative z-10">
              <Image
                src="/assets/img/product-details/compare-glow-pink.png"
                alt="glow"
                width={350}
                height={350}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="w-full md:w-[33%] md:pl-4">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-6 md:mb-5">{rightContent.title}</h2>
          <div className="space-y-3 md:space-y-2.5">
            {rightContent.points.map((point, i) => (
              <p key={i} className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-relaxed md:leading-normal mb-2 last:mb-0 md:w-[85%] w-full flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">{rightContent.icon}</span>
                <span>{point}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareProduct