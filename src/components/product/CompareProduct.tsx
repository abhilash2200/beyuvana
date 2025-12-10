"use client";

import Image from "next/image";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { fallbackProducts, type Product } from "@/app/data/fallbackProducts";

interface CompareProductProps {
  layoutType?: "pink" | "green";
  product?: Product;
}

const CompareProduct = ({
  layoutType = "pink",
  product,
}: CompareProductProps) => {
  const bgColor = layoutType === "pink" ? "#FFF6F6" : "#EBFCEE";

  // Get product from prop or fetch from fallbackProducts based on layoutType
  let resolvedProduct: Product | undefined = product;

  if (!resolvedProduct) {
    // Map layoutType to design_type
    const designType = layoutType === "pink" ? "PINK" : "GREEN";
    resolvedProduct = fallbackProducts.find(
      (p) => p.design_type === designType,
    );
  }

  // Get compare product data from resolved product
  const compareData = resolvedProduct?.compareProduct;

  // If no compare data is available, don't render the component
  if (!compareData) {
    return null;
  }

  const leftContent = compareData.leftContent;
  const rightContent = compareData.rightContent;
  const compareImage = compareData.image;

  return (
    <div
      className="md:p-8 p-4 rounded-[20px] shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-wrap justify-between gap-y-10 md:gap-y-8">
        <div className="w-full md:w-[33%] md:pr-4">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-6 md:mb-5">
            {leftContent.title}
          </h2>
          <div className="space-y-3 md:space-y-2.5">
            {leftContent.points.map((point, i) => (
              <p
                key={i}
                className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-relaxed md:leading-normal mb-2 last:mb-0 md:w-[85%] w-full flex items-start gap-2"
              >
                <span className="flex-shrink-0 mt-0.5">
                  <FaRegCheckCircle className="text-green-600" />
                </span>
                <span>{point}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[33%] relative flex items-center justify-center md:my-4">
          <div className="flex items-center justify-center w-full md:w-auto">
            <div className="bg-white w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full flex items-center justify-center relative z-10">
              <Image
                src={compareImage}
                alt="glow"
                width={350}
                height={350}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-[33%] md:pl-4">
          <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-6 md:mb-5">
            {rightContent.title}
          </h2>
          <div className="space-y-3 md:space-y-2.5">
            {rightContent.points.map((point, i) => (
              <p
                key={i}
                className="text-[#1A2819] font-normal md:text-[15px] text-[13px] leading-relaxed md:leading-normal mb-2 last:mb-0 md:w-[85%] w-full flex items-start gap-2"
              >
                <span className="flex-shrink-0 mt-0.5">
                  <FaRegTimesCircle className="text-red-600" />
                </span>
                <span>{point}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProduct;
