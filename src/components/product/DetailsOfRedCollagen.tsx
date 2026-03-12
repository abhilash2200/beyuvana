"use client";

import { useMemo } from "react";
import Image from "next/image";
import ImageGalleryDialogWithPdf from "@/components/ui/ImageGalleryDialogWithPdf";
import type { Product } from "@/app/data/productTypes";
import { mapCertificateImagesToGallery } from "@/lib/productGalleryUtils";

const DetailsOfRedCollagen = ({ product }: { product?: Product }) => {
  const coreActivities = [
    {
      title: " Brightens skin tone",
      desc: "Glutathione + Vitamin C reduce melanin & even out skin tone",
    },
    {
      title: "Reduces dark spots",
      desc: "Liposomal Glutathione lightens pigmentation and fades blemishes ",
    },
    {
      title: "Combats acne",
      desc: "Zinc + Licorice control oil and reduce inflammation",
    },
    {
      title: "Soothes breakouts",
      desc: "Green Tea Extract + Aloe calm redness & irritation",
    },
    {
      title: "Deeply hydrates skin",
      desc: "Hyaluronic Acid + Amla boost water retention from within",
    },
    {
      title: "Strengthens skin barrier",
      desc: "Biotin + Vitamin E support skin elasticity & repair ",
    },
    {
      title: "Boosts antioxidant defense",
      desc: "Grape Seed + CoQ10 neutralize free radicals & delay skin aging",
    },
    {
      title: "Detoxifies at cellular level",
      desc: "Glutathione helps clear toxins that dull and damage the skin",
    },
    {
      title: "Balances gut-skin axis",
      desc: "Shatavari, Ashwagandha, Amla reduce cortisol & improve digestion",
    },
    {
      title: "Promotes natural glow",
      desc: "All 18 actives synergize to restore youthful, glowing skin from within",
    },
  ];

  const certificateImg = product?.certificateImg;
  const certificateImages = product?.certificateImages;
  const triggerImg =
    certificateImg ?? (certificateImages && certificateImages[0]);

  // Map certificate images to gallery items with PDFs
  const certificateGalleryItems = useMemo(() => {
    const images =
      certificateImages ?? (certificateImg ? [certificateImg] : []);
    if (images.length === 0) return [];
    // Product ID 2 = PINK design type
    return mapCertificateImagesToGallery(images, "PINK", product?.name);
  }, [certificateImages, certificateImg, product?.name]);

  return (
    <div>
      <div className="bg-[#E02D2D] rounded-[20px] md:p-6 p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-[48%]">
            <h2 className="text-white font-[Grafiels] md:text-[23px] text-[18px] leading-tight mb-5">
              WHY CHOOSE BEYUVANA™ Glow Essence
            </h2>
            <p className="text-white mb-2 leading-relaxed font-light">
              BEYUVANA™ Glow Essence is India&apos;s 1st sachet-based glow
              therapy powered by 18 elite plant actives. It brightens skin,
              reduces pigmentation, and supports collagen with Glutathione,
              Vitamin C & Bamboo. Amla, Inulin, and Guava Leaf help heal your
              gut—because glow starts from within.
            </p>
            <p className="text-white mb-6 leading-relaxed font-light">
              Ashwagandha and Turmeric calm stress and fight inflammation, while
              Black Pepper boosts absorption. Each sugar-free, vegetarian sachet
              is your daily dose of skin radiance, gut vitality, and inner
              balance.
            </p>
            <Image
              src="/assets/img/product-details/Artboard_1.webp"
              width={772}
              height={500}
              alt="detail info"
              className="w-full h-auto mb-6"
            />
            {triggerImg && certificateGalleryItems.length > 0 && (
              <div className="flex items-center justify-start gap-x-2 mt-4">
                <ImageGalleryDialogWithPdf
                  items={certificateGalleryItems}
                  title="Lab Certificates"
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-2 group hover:cursor-pointer hover:no-underline"
                    >
                      <Image
                        src={triggerImg}
                        alt="certificate"
                        width={40}
                        height={40}
                        className="w-auto h-auto"
                      />
                      <p className="text-sm text-gray-200 group-hover:underline">
                        View Lab Certificates
                      </p>
                    </button>
                  }
                  onPdfOpen={() => {
                    // PDF opened
                  }}
                />
              </div>
            )}
          </div>

          <div className="w-full md:w-[48%]">
            <h2 className="text-[#22014] font-[Grafiels] md:text-[23px] text-[18px] leading-tight mb-5 bg-white text-center rounded-[20px] py-4">
              10 CORE ACTIVITIES, 10 PROVEN FUNCTIONS
            </h2>
            <div className="p-4 bg-[#000000]/50 rounded-[20px]">
              {coreActivities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-white last:border-b-0 border-dashed text-white py-4"
                >
                  <div className="w-[35%]">
                    <p className="font-light text-[15px]">{item.title}</p>
                  </div>
                  <div className="font-light text-[13px] w-[60%]">
                    <p className="mb-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOfRedCollagen;
