"use client"
import React from 'react'
import HeaderText from '@/components/common/HeaderText'
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from '@/components/contact/ContactForm';

const page = () => {
  return (
    <>
      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-wrap justify-between items-center'>
            <div className='w-full md:w-[60%]'>
              <div className='flex flex-col mb-5'>
                <HeaderText textalign="text-left" heading="Contact Us" textcolor="text-[#057A37]" />
                <p className='mb-3'>At Beyuvana, we are committed to providing high-quality, plant-based collagen products that support your health and beauty goals. At Beyuvana, we are committed to providing high-quality, plant-based collagen</p>
                <p>At Beyuvana, we are committed to providing high-quality, plant-based collagen </p>
              </div>
              <div className='flex flex-wrap justify-between w-full md:max-w-[60%] gap-y-4 mb-5'>
                <div className="w-full md:w-[48%] flex flex-col gap-4">
                  <p className="font-semibold text-lg">Get in touch with us:</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Phone className="text-[#057A37] w-5 h-5" />
                      <a href="tel:+917003810162" className="text-gray-700 hover:underline">
                        +91 7003810162
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-[#057A37] w-5 h-5" />
                      <a href="mailto:info@beyuvana.com" className="text-gray-700 hover:underline">
                        info@beyuvana.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-[#057A37] w-5 h-5" />
                      <span className="text-gray-700">Kolkata, India</span>
                    </div>
                  </div>
                </div>
                <div className='w-[1px] h-auto bg-[#000]'></div>
                <div className="w-full md:w-[48%] flex flex-col gap-4">
                  <p className="font-semibold text-lg">For business queries:</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <p className="text-gray-700">Monday - Friday</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-700">10am - 7pm</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700">Saturday & sunday closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full md:w-[38%]'>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default page