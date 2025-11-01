"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { validateRequired, validateEmail, validatePhone } from "@/lib/validation"
import { contactApi } from "@/lib/api"
import { notifications } from "@/lib/notifications"

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

        const nameValidation = validateRequired(formData.name, "Name")
        if (!nameValidation.isValid) newErrors.name = nameValidation.error || "Name is required"

        const emailValidation = validateEmail(formData.email)
        if (!emailValidation.isValid) newErrors.email = emailValidation.error || "Valid email is required"

        const phoneValidation = validatePhone(formData.phone)
        if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error || "Enter 10-digit phone number"

        const subjectValidation = validateRequired(formData.subject, "Subject")
        if (!subjectValidation.isValid) newErrors.subject = subjectValidation.error || "Subject is required"

        const messageValidation = validateRequired(formData.message, "Message")
        if (!messageValidation.isValid) newErrors.message = messageValidation.error || "Message cannot be empty"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) {
            notifications.contact.validationError();
            return;
        }

        setLoading(true)
        try {
            const response = await contactApi.submit(formData);

            if (response.success !== false && response.status !== false) {
                notifications.contact.formSuccess();
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
                setErrors({})
            } else {
                notifications.contact.formError();
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Contact form submission error:", error);
            }
            notifications.contact.formError();
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="w-full md:max-w-xl mx-auto bg-[#F2FFF7] shadow-md">
            <div className="bg-[#057A37] w-full p-4 leading-none">
                <h2 className="text-2xl font-[Grafiels] text-[#FFF] text-left">
                    Enquire Online
                </h2>
            </div>

            <div className="md:px-8 px-4 md:py-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <Input
                            id="name"
                            type="text"
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
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
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
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
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
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
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
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
                            className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
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
                        className="w-full bg-[#057A37] hover:bg-green-700 text-white py-4 md:rounded-[5px] rounded-[3px]"
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