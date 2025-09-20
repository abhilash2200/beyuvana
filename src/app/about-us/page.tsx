"use client"
import WhatMakes from '@/components/about/WhatMakes'
import HeaderText from '@/components/common/HeaderText'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <>

      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap justify-between items-center'>
            <div className='w-full md:w-[60%]'>
              <HeaderText textalign="text-left" heading="Welcome to BEYUVANA" textcolor="text-[#1A2819]" />
              <h3 className='text-[#3B3B3B] font-semibold text-[18px] mb-5'>Plant-Based Nutrition. Honest Wellness. Real Results.</h3>
              <div className='max-w-[85%] flex flex-col gap-4 mb-3'>
                <p>Our philosophy is simple: clean, transparent, and
                  effective nutrition that supports your skin, gut, and overallbalance—without shortcuts, unnecessary fillers, or hidden additives.
                  Unlike ordinary capsules that typically carry only 600–800 mg of actives, every BEYUVANA™ sachet delivers a full 8,000 mg of carefully
                  selected nutrients—that’s 10X more nourishment in a form your body can truly absorb</p>
                <p>
                  We bring together the wisdom of ancient botanicals and the precision of modern nutrition, ensuring each blend is safe,
                </p>
                <p>
                  complete, and effective. While serums only work on the surface and capsules often provide limited nutrition, <span className='font-bold text-[#3B3B3B]'>BEYUVANA™</span> works from within—supporting collagen, hydration, gut balance, and a radiant glow that lasts.
                </p>
                <p>
                  With a strong focus on purity, quality, and honesty, BEYUVANA™ is not just another
                  supplement—it’s a commitment to long-term vitality, timeless beauty, and natural well-
                  being.
                </p>
              </div>
              <h4 className='font-semibold text-[#3A3A3A] text-[18px]'>BEYUVANA™— Wellness, Naturally.</h4>
            </div>
            <div className='w-full md:w-[33%]'>
              <Image src="/assets/img/about-logo.png" width={537} height={537} alt="BEYUVANA" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 relative">
        <Image src="/assets/img/about-bg.png" alt="about" fill className="object-cover object-center -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <HeaderText textalign="text-center" heading="What is BEYUVANA?" textcolor="text-[#1A2819]" />
          <div className='flex items-center justify-center mb-4'>
            <h3 className='text-white font-normal text-[20px] bg-[#122014] rounded-full px-10 py-4 font-[Grafiels]'><span className='text-[#DFC362]'>BEYUVANA</span> = Be + Yuvana = "Be Youthful. Be Alive. Be You."</h3>
          </div>
          <div className='text-center flex flex-col items-center justify-center'>
            <p className='max-w-[1000px] mb-3'>We are a plant-based nutrition brand rooted in Indian heritage and powered by science. But we’re more than just anti-aging— We support your daily health, gut balance, glowing skin, energy, and inner wellness.</p>
            <p className='max-w-[1000px]'>We believe true beauty and wellness begin inside your body—not just on your skin. And we believe that clean, high-quality nutrition should be accessible to everyone— Not just the elite.</p>
          </div>
        </div>
      </section>

      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <HeaderText textalign="text-center" heading="What Makes Us Different?" textcolor="text-[#1A2819]" />
          <WhatMakes />
        </div>
      </section>

      <section className='py-10 bg-[#122014]'>
        <div className='container mx-auto px-4'>
          <HeaderText textalign="text-center" heading="Why We Exist?" textcolor="text-white" />
          <h3 className='text-white text-[20px] text-center'>We created <span className='text-[#DFC362] font-medium'>BEYUVANA™</span> for people like you—</h3>
          <div className='flex flex-wrap justify-between items-center text-white my-6'>
            <div className='w-full md:w-[30%] flex items-center justify-center gap-x-4'>
              <p className='px-7 py-6 border-white border-1 border-dashed rounded-full'>01</p>
              <p className='font-light'>People tired of chemical shortcuts and expensive pills.</p>
            </div>
            <div className='w-full md:w-[30%] flex items-center justify-center gap-x-4'>
              <p className='px-7 py-6 border-white border-1 border-dashed rounded-full'>02</p>
              <p className='font-light'>People who want to feel alive, confident, strong, and naturally well.</p>
            </div>
            <div className='w-full md:w-[30%] flex items-center justify-center gap-x-4'>
              <p className='px-7 py-6 border-white border-1 border-dashed rounded-full'>03</p>
              <p className='font-light'>People who believe in real nourishment, not trends.</p>
            </div>
          </div>
          <p className='text-center text-[#FFFFFF] font-light mb-4'><span className='mb-1'>We understand your struggle.</span><br /><span className='mb-1'>We’ve lived it.care.</span><br /><span className='mb-1'>That’s why every BEYUVANA product is made with heart, tested with honesty, and priced with</span></p>
          <p className='text-center text-[#FFFFFF] font-light'>We don’t want to just sell wellness—we want to help you <span className='text-[#DFC362]'>live it, feel it, and love it.</span></p>
        </div>
      </section>

      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap justify-between items-center'>
            <div className='w-full md:w-[48%]'>
              <div className='flex flex-col'>
                <Image src="/assets/img/misison.pmg" width={463} height={406} alt="misison" />
                <h2 className='text-[#122014] font-[Grafiels] text-[25px]'>Mission</h2>
                <p className='max-w-[80%]'>To empower every household with clean, affordable, plant-based nutrition—Helping people glow naturally, live energetically, and age gracefully, without ever compromising on quality or values.</p>
              </div>
            </div>
            <div className='w-1 h-96 border-r-1 border-dashed'></div>
            <div className='w-full md:w-[48%]'>
              <div className='flex flex-col'>
                <Image src="/assets/img/vision.pmg" width={463} height={406} alt="vision" />
                <h2 className='text-[#122014] font-[Grafiels] text-[25px]'>Vision</h2>
                <p className='max-w-[80%]'>To empower every household with clean, affordable, plant-based nutrition—Helping people glow naturally, live energetically, and age gracefully, without ever compromising on quality or values.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default page