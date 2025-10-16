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
import ResProductImg from "./ResponsiveV/ResProductImg";
import ResSelectPack from "./ResponsiveV/ResSelectPack";
import ResDropdown from "./ResponsiveV/ResDropdown";
import { productDesignSlugs } from "@/app/data/productConfigs";
import { slugify } from "@/lib/utils";
import { backendProductIdMap } from "@/app/data/productConfigs";
import InfluencerVideos from "./InfluencerVideos";

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
  { percent: "85%", title: "Brighter Skin –", subtitle: "Improvement" },
  { percent: "80%", title: "Acne Reduction – ", subtitle: "Clearer Skin" },
  { percent: "72%", title: "Hydration – More", subtitle: "Hydrated & Plump Skin" },
  { percent: "60%", title: "Gut Balance – Better", subtitle: "Gut-Skin Harmony" },
]

export default function Product2Layout({ product }: { product: Product }) {
  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <div className="w-full md:w-[30%]">
            <div className="hidden md:block">
              <ProductImg images={product.images} />
            </div>
            <div className="block md:hidden">
              <ResProductImg images={product.images} />
            </div>
          </div>
          <div className="w-full md:w-[30%]">
            <ProductDetails name={product.name} tagline={product.tagline} description={product.description} certificateImg={product.certificateImg} certificateImages={product.certificateImages} faq={product.faq} productId={product.id} />
          </div>
          <div className="w-full md:w-[30%]">
            <div className="hidden md:block">
              <SelectPack
                productId={productDesignSlugs[product.id] || slugify(product.name)}
                designType="pink"
              />
            </div>
            <div className="block md:hidden">
              <ResSelectPack
                productId={productDesignSlugs[product.id] || slugify(product.name)}
                designType="pink"
              />
            </div>
          </div>
        </div>
        <hr className="my-10" />
        <div className="md:py-10 py-6">
          <div className="flex flex-wrap justify-between items-center text-center gap-y-10">
            {data.map((item, i) => (
              <div key={i} className="w-[45%] md:w-[28%] relative">
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
        <div className="md:py-10 py-6">
          <HeaderText textalign="text-center" heading="Our Influencer Videos" textcolor="text-[#1A2819]" />
          <InfluencerVideos />
        </div>
        <div className="md:py-10 py-6 bg-[#FFF0F0] rounded-[20px]">
          <div className="flex flex-col">
            <div className="relative px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-[50%] md:py-26 md:pl-10">
                  <div className="mb-6">
                    <p className="border border-[#B00404] text-[#B00404] rounded-[8px] px-4 py-2 text-[15px] inline-flex">10 Transformative Actions. 1 Smart Sachet.</p>
                  </div>
                  <h2 className="font-[Grafiels] md:text-[25px] text-[18px] text-[#303030] leading-tight md:leading-relaxed mb-3 max-w-[80%]">BEYUVANA™ Glow Essence + 18 Synergistic Ingredients</h2>
                </div>
                <div className="w-full md:w-[50%] hidden md:block">
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
              <Action product={product} />
            </div>
          </div>
        </div>
        <div className="md:py-10 py-6">
          <div className="flex flex-wrap items-center justify-between gap-y-10">
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
              <h2 className="text-[#1A2819] font-[Grafiels] md:text-[25px] text-[18px] leading-tight mb-3">Experience Visible Transformation in 10 Weeks</h2>
              <p className="mb-4 md:leading-relaxed text-[15px] leading-tight font-light">
              Our clinical-style transformation chart reflects the powerful effects of BEYUVANA™  Glow Essence. With consistent use, you’ll notice real, measurable improvements—designed by nature, proven by science.Within just 10 weeks . Results may vary by individual. Based on ingredient research and regular usage.
              </p>
            </div>
          </div>
        </div>
        <div className="md:py-10 py-6">
          <div className="flex flex-wrap items-center justify-between gap-y-10">
            <div className="w-full md:w-[40%]">
              <HeaderText textalign="text-left" heading="Powered by Research-Backed Ingredients in BEYUVANA™ GLOW ESSENCE." textcolor="text-[#1A2819]" />
              <p className="mb-6">Improvement in just 10 weeks</p>
              <div className="flex flex-wrap justify-between gap-4">
                {stats.map((item, index) => (
                  <div key={index} className="w-[45%] md:w-[47%]">
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
        <div className="md:py-10 py-6">
          <HeaderText textalign="text-center" heading="WHY BEYUVANA™ GLOW ESSENCE WORKS" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4">Glow Essence is not just a skin product. It’s a skin nutrition revolution from within — combining glow boosters, antioxidants, collagen supporters, gut balancers, and anti-inflammatories in one intelligent formula.</p>
          <WhyBeyuvana product={product} />
        </div>
        <div className="md:py-10 py-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-[48%]">
              <Image src="/assets/img/product-details/green-288484.png" width={772} height={684} alt="detail info" className="w-full h-auto" />
            </div>
            <div className="w-full md:w-[48%]">
              <Compare product={product} />
            </div>
          </div>
        </div>
        <div className="md:py-10 py-6 bg-[#FFF9F9] rounded-[20px]">
          <HeaderText textalign="text-center" heading="WHO IS BEYUVANA™ GLOW ESSENCE MADE FOR?" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 max-w-[90%] leading-tight">BEYUVANA™ is designed for modern individuals who want results without compromise —using only clean, plant-based ingredients that are backed by science and safe for everyday use.</p>
          <Builder product={product} />
        </div>
        <div className="md:py-10 py-6">
          <HeaderText textalign="text-center" heading="The Hidden Reasons Your Skin Loses Its Radiance So quickly" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 max-w-[90%] leading-tight">Stress, pollution, UV exposure, poor sleep, and nutrient deficiencies silently disrupt your skin’s balance — breaking down collagen, dulling glow, and accelerating aging faster than you realize.</p>
          <div className="hidden md:block">
            <TabData productId={product.id} />
          </div>
          <div className="block md:hidden">
            <ResDropdown productId={product.id} />
          </div>
        </div>
      </div>
      <div className="md:py-10 py-6">
        <HeaderText textalign="text-center" heading="India’s Most Advanced Anti-Aging Innovation" textcolor="text-[#1A2819]" />
        <p className="text-center mb-4 max-w-[90%] leading-tight">Collagen Reglow delivers clinically proven ingredients in precision-dosed sachets for maximum skin transformation.</p>
        <div className="py-6">
          <AdvancedPlant product={product} />
        </div>
      </div>
      <div className="md:py-10 py-6">
        <div className="container mx-auto px-4">
          <DetailsOfRedCollagen />
        </div>
      </div>
      <div className="md:py-10 py-6">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="GLOW ESSENCE VS OTHER PRODUCTS" textcolor="text-[#1A2819]" />
          <p className="text-center mb-4 md:w-[90%] w-full mx-auto leading-tight px-4">“Powered by 18 precision-selected plant actives to nourish your skin, strengthen your gut, and restore emotional balance.”</p>
          <CompareProduct />
        </div>
      </div>
      <div className="md:py-10 py-6">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="Customer Reviews" textcolor="text-[#1A2819]" />
          <CustomerReviews
            productId={backendProductIdMap[product.id] ?? product.id}
            productName={product.name}
            designSlug={productDesignSlugs[product.id]}
          />
        </div>
      </div>
      <div className="md:py-10 py-6">
        <div className="container mx-auto px-4">
          <HeaderText textalign="text-center" heading="Frequently Asked Questions" textcolor="text-[#1A2819]" />
          <ProductFaq productId={2} />
        </div>
      </div>
    </>
  );
}