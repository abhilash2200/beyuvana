"use client"
import { Product } from "@/app/data/fallbackProducts";
import ProductDetails from "./ProductDetails";
import SelectPack from "./SelectPack";
import ProductImg from "./ProductImg";
import Image from "next/image";
import Action from "./Action";
import HeaderText from "../common/HeaderText";
import WhyBeyuvana from "./WhyBeyuvana";
import Compare from "./Compare";
import Builder from "./Builder";
import TabData from "./TabData";
import AdvancedPlant from "./AdvancedPlant";
import DetailsOfRedCollagen from "./DetailsOfRedCollagen";
import CustomerReviews from "./CustomerReviews";
import ProductFaq from "./ProductFaq";
import CompareProduct from "./CompareProduct";

const data = [
  {
    img: "/assets/img/r1.png",
    text: "Glow &<br /> Brightening",
  },
  {
    img: "/assets/img/r2.png",
    text: "Dark Spots & <br/>Pigmentation",
  },
  {
    img: "/assets/img/r3.png",
    text: "Acne & Clear <br/>Skin",
  },
  {
    img: "/assets/img/r4.png",
    text: "Skin <br/>Hydration",
  },
  {
    img: "/assets/img/r5.png",
    text: "Gut<br/> & Health",
  },
  {
    img: "/assets/img/r6.png",
    text: "Stress<br/> & Balance",
  },
]

interface StatCard {
  percent: string
  title: string
  subtitle: string
}

const stats: StatCard[] = [
  { percent: "75%", title: "Increase in", subtitle: "Skin Hydration" },
  { percent: "70%", title: "Increase in", subtitle: "Skin Glow" },
  { percent: "68%", title: "Increase in", subtitle: "Skin Elasticity" },
  { percent: "60%", title: "Reduce in", subtitle: "Pigmentation" },
]

export default function Product2Layout({ product }: { product: Product }) {
  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <div className="w-full md:w-[30%]">
            <ProductImg images={product.images} />
          </div>
          <div className="w-full md:w-[30%]">
            <ProductDetails name={product.name} tagline={product.tagline} description={product.description} certificateImg={product.certificateImg} faq={product.faq} productId={product.id} />
          </div>
          <div className="w-full md:w-[30%]">
            <SelectPack productId="collagen-pink" />
          </div>
        </div>
        <hr className="my-10" />
        <div className="py-10">
          <div className="flex flex-wrap justify-between items-center text-center gap-y-10">
            {data.map((item, i) => (
              <div key={i} className="w-full md:w-[28%] relative">
                <div className="flex flex-wrap items-center justify-center gap-x-4">
                  <Image src={item.img} alt="certificate" width={136} height={136} />
                  <p
                    className="text-sm text-gray-900 text-left max-w-[80%]"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
                {(i + 1) % 3 !== 0 && i !== data.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-[#000] hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="py-10 bg-[#FFF0F0] rounded-[20px]">
          <div className="flex flex-col">
            <div className="relative px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-[50%] py-26 pl-10">
                  <div className="mb-6">
                    <p className="border border-[#B00404] text-[#B00404] rounded-[8px] px-4 py-2 text-[15px] inline-flex">10 ACTIONS. 1 SMART SACHET</p>
                  </div>
                  <h2 className="font-[Grafiels] text-[25px] text-[#303030] leading-tight mb-3 max-w-[80%]">A Premium Collagen Builder Powered by 21 Synergistic Plant-Based Actives</h2>
                </div>
                <div className="w-full md:w-[50%]">
                  <div className="absolute bottom-0.5 right-0">
                    <Image src="/assets/img/product-details/action-green.png" alt="action" width={448} height={368} className="w-full h-auto" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <hr className="w-full" />
              </div>
            </div>
            <div className="py-6 px-4">
              <Action />
            </div>
          </div>
        </div>
        <div className="py-10">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-[48%]">
              <Image
                src="/assets/img/product-details/pink-detail-info.png"
                width={880}
                height={580}
                alt="detail info"
                className="w-full h-auto"
              />
            </div>
            <div className="w-full md:w-[48%]">
              <h2 className="text-[#1A2819] font-[Grafiels] text-[25px] mb-3">Experience Visible Transformation in 10 Weeks</h2>
              <p className="mb-4">
                Our clinical-style transformation chart reflects the powerful effects of BEYUVANA™ Glow Essence.
              </p>
              <p className="mb-4">
                With consistent use, you’ll notice real, measurable improvements—designed by nature, proven by
                science.Within just 10 weeks .
              </p>
              <p className="mb-4">
                Results may vary by individual. Based on ingredient research and regular
                usage.
              </p>
            </div>
          </div>
        </div>
        <div className="py-10">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-[40%]">
              <HeaderText textalign="text-left" heading="Powered by Research-Backed Ingredients in BEYUVANA™ GLOW ESSENCE." textcolor="text-[#1A2819]" />
              <p className="mb-6">Improvement in just 10 weeks</p>
              <div className="flex flex-wrap justify-between gap-4">
                {stats.map((item, index) => (
                  <div key={index} className="w-full md:w-[47%]">
                    <div className="flex flex-col items-center gap-y-2 px-4 py-6 bg-[#FFE7E7] rounded-[20px]">
                      <h2 className="text-[#B00404] font-[Grafiels] text-[30px] leading-tight">{item.percent}</h2>
                      <p className="text-center">
                        {item.title}
                        <br /> {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-[48%]">
              <Image
                src="/assets/img/product-details/green-lady.png"
                width={880}
                height={580}
                alt="detail info"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        <div className="py-10">
          <HeaderText textalign="text-center" heading="Why the BEYUVANA™ PREMIUM COLLAGEN BUILDER Works" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4">BEYUVANA™ isn’t just another supplement — it’s a multi-action, plant-powered skin nutrition system designed to target the root causes of aging, not just the symptoms. Heres why it delivers real, visible results:</p>
          <WhyBeyuvana product={product} />
        </div>
        <div className="py-10">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-[48%]">
              <Image src="/assets/img/product-details/green-288484.png" width={772} height={684} alt="detail info" className="w-full h-auto" />
            </div>
            <div className="w-full md:w-[48%]">
              <Compare />
            </div>
          </div>
        </div>
        <div className="py-10 bg-[#F8FFF9] rounded-[20px]">
          <HeaderText textalign="text-center" heading="Who Is BEYUVANA™ Premium Collagen Builder Made For?" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 max-w-[90%] leading-tight">BEYUVANA™ is designed for modern individuals who want results without compromise —using only clean, plant-based ingredients that are backed by science and safe for everyday use.</p>
          <Builder />
        </div>
        <div className="py-10">
          <HeaderText textalign="text-center" heading="The Hidden Reasons Your Skin Loses Its Radiance So quickly" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 max-w-[90%] leading-tight">Stress, pollution, UV exposure, poor sleep, and nutrient deficiencies silently disrupt your skin’s balance — breaking down collagen, dulling glow, and accelerating aging faster than you realize.</p>
          <TabData productId={product.id} />
        </div>
      </div>
      <div className="py-10">
        <HeaderText textalign="text-center" heading="India’s Most Advanced Anti-Aging Innovation" textcolor="text-[#1A2819]" />
        <p className="text-center mb-4 max-w-[90%] leading-tight">Collagen Reglow delivers clinically proven ingredients in precision-dosed sachets for maximum skin transformation.</p>
        <div className="py-6">
          <AdvancedPlant />
        </div>
      </div>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <DetailsOfRedCollagen />
        </div>
      </div>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="GLOW ESSENCE VS OTHER PRODUCTS" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 max-w-[90%] leading-tight">“Powered by 18 precision-selected plant actives to nourish your skin, strengthen your gut, and restore emotional balance.”</p>
          <CompareProduct />
        </div>
      </div>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="Customer Reviews" textcolor="text-[#1A2819]" />
          <CustomerReviews />
        </div>
      </div>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="Frequently Asked Questions" textcolor="text-[#1A2819]" />
          <ProductFaq productId={2} />
        </div>
      </div>
    </>
  );
}