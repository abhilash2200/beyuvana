"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface FormData {
    name: string
    email: string
    phone: string
    subject: string
    message: string
}

const ContactForm: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [errors, setErrors] = useState<Partial<FormData>>({})

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const validate = () => {
        const newErrors: Partial<FormData> = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Valid email is required"
        if (!formData.phone.match(/^\d{10}$/))
            newErrors.phone = "Enter 10-digit phone number"
        if (!formData.subject.trim()) newErrors.subject = "Subject is required"
        if (!formData.message.trim()) newErrors.message = "Message cannot be empty"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert("Form submitted ✅")
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        }, 1500)
    }

    return (
        <section className="w-full max-w-xl mx-auto bg-[#F2FFF7] shadow-md">
            <div className="bg-[#057A37] w-full p-4 leading-none">
                <h2 className="text-2xl font-[Grafiels] text-[#FFF] text-left">
                    Enquire Online
                </h2>
            </div>

            <div className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <Input
                            id="name"
                            type="text"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] rounded-[5px]"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">{errors.name}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Input
                            id="email"
                            type="email"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] rounded-[5px]"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Input
                            id="phone"
                            type="tel"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] rounded-[5px]"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone && (
                            <span className="text-red-500 text-sm">{errors.phone}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Input
                            id="subject"
                            type="text"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] rounded-[5px]"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        {errors.subject && (
                            <span className="text-red-500 text-sm">{errors.subject}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Textarea
                            id="message"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] rounded-[5px]"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        {errors.message && (
                            <span className="text-red-500 text-sm">{errors.message}</span>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-[5px]"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </div>
        </section>
    )
}

export default ContactForm