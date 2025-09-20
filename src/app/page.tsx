"use client"

import HeaderText from "@/components/common/HeaderText"
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
            <HeaderText textalign="text-center" heading="About Beyuvana" textcolor="text-[#1A2819]" />
            <h4 className="text-[#3B3B3B] font-medium md:text-[20px] text-[18px] mb-2">Nourishment That Goes Deeper Than Skin.</h4>
            <p className="max-w-[800px] font-light">At BEYUVANA™, we create plant-powered wellness formulations backed by modern science, crafted with clinically researched ingredients, lab-tested for safety, and made 100% vegetarian—so you always know exactly what youre putting into your body. </p>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0">
          <Image src="/assets/img/choose-bg.png" alt="Decorative background" fill priority className="object-cover" />
        </div>
        <div className="container mx-auto px-4 py-10 relative">
        <HeaderText textalign="text-center" heading="Why Choose BEYUVANA™" textcolor="text-[#1A2819]" />
          <Choose />
        </div>
      </section>

      <section className="py-10 bg-[#A9B528]">
        <div className="container mx-auto px-4">
          <Toxins />
        </div>
      </section>

      <section className="py-10">
        {/* <div className="container mx-auto px-4"> */}
          <ProductsList />
        {/* </div> */}
      </section>

      <section className="py-10">
        <div className="container mx-auto md:ps-20 lg:ps-8">
          <div className="flex flex-col items-center justify-center gap-y-2">
          <HeaderText textalign="text-center" heading="Our Influencer Videos" textcolor="text-[#1A2819]" />
            <p className="w-full md:max-w-[60vw] font-light text-center">Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.</p>
          </div>
        </div>
        <div className="pt-12 ms-auto">
          <InfluencerVideo />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-y-2">
          <HeaderText textalign="text-center" heading="Why You Need BEYUVANA — Right Now" textcolor="text-[#1A2819]" />
            <p className="md:max-w-[60vw] w-full font-light text-center">BEYUVANA gives your body everything it needs to rebuild collagen naturally:</p>
          </div>
          <WhyNeed />
          <div className="relative mt-10">
            <div className="flex flex-col justify-center items-center">
              <Image src="/assets/img/port1.webp" width={1400} height={180} alt="port" className="w-auto h-[180px] md:w-full md:h-auto" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2">
                <h2 className="text-[#FFF] font-[Grafiels] md:text-[30px] text-[20px]">One sachet a day <span className="text-[#DFC362]">= inner healing + outer glow</span></h2>
                <p className="text-[15px] md:text-[20px] text-white">Start early. Stay youthful longer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-6">
          <HeaderText textalign="text-center" heading="Customer Testimonials" textcolor="text-[#057A37]" />
          </div>
          <Testimonial />
        </div>
      </section>

      <section className="pt-10 pb-20">
        <div className="container mx-auto px-4">
          <CashBack />
        </div>
      </section>

      <section className="bg-[#F8F8F8] md:py-20 py-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-x-2 items-center justify-between">
            <div className="w-fill md:w-[30%] relative">
              <div className="absolute top-1/2 -translate-y-1/2">
                <Image src="/assets/img/money-back.png" width={474} height={474} alt="money back" className="w-[385px] h-[385px] hidden md:block" />
              </div>
            </div>
            <div className="w-fill md:w-[68%]">
              <div className="flex flex-col gap-y-4">
              <HeaderText textalign="text-left" heading="BEYUVANA™ 60-Day Money-Back Guarantee" textcolor="text-[#057A37]" />
                <p className="text-[#222222]">At BEYUVANA™, your trust means everything to us. We stand by the quality of our plant-powered formulations, and we want you to feel completely confident on your wellnes journey. That’s why we offer a 60-Day Money-Back Promise on your first purchase,
                  exclusively from our website.</p>
                  
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10 md:pt-20 pt-10">
        <div className="container mx-auto px-4">
          <HomeAccordion />
        </div>
      </section>

    </>
  )
}

export default page