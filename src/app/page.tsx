"use client"

import CashBack from "@/components/home/CashBack"
import Choose from "@/components/home/Choose"
import HomeAccordion from "@/components/home/HomeAccordion"
import InfluencerVideo from "@/components/home/InfluencerVideo"
import ProductsList from "@/components/home/ProductsList"
import Testimonial from "@/components/home/Testimonial"
import Toxins from "@/components/home/Toxins"
import Video from "@/components/home/Video"
import WhyNeed from "@/components/home/WhyNeed"
import Image from "next/image"

const page = () => {
  return (
    <>
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Video />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h2 className="font-[Grafiels] text-[1.5vw]">About Beyuvana</h2>
            <h4 className="text-[#3B3B3B] font-medium text-[1vw] mb-2">Nourishment That Goes Deeper Than Skin.</h4>
            <p className="max-w-[60vw] font-light">At BEYUVANA™, we create plant-powered wellness formulations backed by modern science, crafted with clinically researched ingredients, lab-tested for safety, and made 100% vegetarian—so you always know exactly what you're putting into your body. </p>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0">
          <Image src="/assets/img/choose-bg.png" alt="Decorative background" fill priority className="object-cover" />
        </div>
        <div className="container mx-auto px-4 py-10 relative">
          <h2 className="text-[#1A2819] font-[Grafiels] text-[1.5vw] text-center mb-4 pb-8">Why Choose BEYUVANA™</h2>
          <Choose />
        </div>
      </section>

      <section className="py-10 bg-[#A9B528]">
        <div className="container mx-auto px-4">
          <Toxins />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <ProductsList />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto md:ps-20 lg:ps-8">
          <div className="flex flex-col items-center justify-center gap-y-2">
            <h2 className="text-[#1A2819] font-[Grafiels] text-[1.5vw]">Our Influencer Videos</h2>
            <p className="max-w-[60vw] font-light text-center">Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.</p>
          </div>
        </div>
        <div className="pt-12 ms-auto">
          <InfluencerVideo />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-y-2">
            <h2 className="text-[#1A2819] font-[Grafiels] text-[1.5vw]">Why You Need BEYUVANA — Right Now</h2>
            <p className="max-w-[60vw] font-light text-center">BEYUVANA gives your body everything it needs to rebuild collagen naturally:</p>
          </div>
          <WhyNeed />
          <div className="relative mt-10">
            <div className="flex flex-col justify-center items-center">
              <Image src="/assets/img/port1.webp" width={1400} height={180} alt="port" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2">
                <h2 className="text-[#FFF] font-[Grafiels] text-[1.5vw]">One sachet a day <span className="text-[#DFC362]">= inner healing + outer glow</span></h2>
                <p className="text-[0.9vw] text-white">Start early. Stay youthful longer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className="text-[#057A37] font-[Grafiels] text-[1.5vw]">Customer Testimonials</h2>
          </div>
          <Testimonial />
        </div>
      </section>

      <section className="pt-10 pb-20">
        <div className="container mx-auto px-4">
          <CashBack />
        </div>
      </section>

      <section className="bg-[#F8F8F8] py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-x-2 items-center justify-between">
            <div className="w-fill md:w-[30%] relative">
              <div className="absolute top-1/2 -translate-y-1/2">
                <Image src="/assets/img/money-back.png" width={474} height={474} alt="money back" className="w-[385px] h-[385px]" />
              </div>
            </div>
            <div className="w-fill md:w-[68%]">
              <div className="flex flex-col gap-y-4">
                <h2 className="text-[#1F1F1F] font-[Grafiels] text-[1.5vw]">BEYUVANA™ 60-Day Money-Back Guarantee</h2>
                <p className="text-[#222222]">At BEYUVANA™, your trust means everything to us. We stand by the quality of our plant-powered formulations, and we want you to feel completely confident on your wellnes journey. That’s why we offer a 60-Day Money-Back Promise on your first purchase,
                  exclusively from our website.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10 pt-20">
        <div className="container mx-auto px-4">
          <HomeAccordion />
        </div>
      </section>

    </>
  )
}

export default page