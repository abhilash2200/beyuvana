"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  validateRequired,
  validateEmail,
  validatePhone,
} from "@/lib/validation";
import { contactApi } from "@/lib/api/contact";
import { notifications } from "@/lib/notifications";
import { handleError } from "@/lib/error-handling";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    const nameValidation = validateRequired(formData.name, "Name");
    if (!nameValidation.isValid)
      newErrors.name = nameValidation.error || "Name is required";

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid)
      newErrors.email = emailValidation.error || "Valid email is required";

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid)
      newErrors.phone = phoneValidation.error || "Enter 10-digit phone number";

    const subjectValidation = validateRequired(formData.subject, "Subject");
    if (!subjectValidation.isValid)
      newErrors.subject = subjectValidation.error || "Subject is required";

    const messageValidation = validateRequired(formData.message, "Message");
    if (!messageValidation.isValid)
      newErrors.message = messageValidation.error || "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      notifications.contact.validationError();
      return;
    }

    setLoading(true);
    try {
      const response = await contactApi.submit(formData);

      if (response.success !== false && response.status !== false) {
        notifications.contact.formSuccess();
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        notifications.contact.formError();
      }
    } catch (error) {
      handleError(error, {
        context: "ContactForm",
        userMessage:
          (error as Error)?.message || "Failed to submit form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full md:max-w-xl mx-auto bg-[#F2FFF7] shadow-md">
      <div className="bg-[#057A37] w-full p-4 leading-none">
        <h2 className="text-2xl font-[Grafiels] text-[#FFF] text-left">
          Enquire Online
        </h2>
      </div>

      <div className="md:px-8 px-4 md:py-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <span
                id="name-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span
                id="email-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="sr-only">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-describedby={errors.phone ? "phone-error" : undefined}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <span
                id="phone-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.phone}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              aria-describedby={errors.subject ? "subject-error" : undefined}
              aria-invalid={errors.subject ? "true" : "false"}
            />
            {errors.subject && (
              <span
                id="subject-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.subject}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="sr-only">
              Your Message
            </label>
            <Textarea
              id="message"
              className="border border-[#606060] bg-white placeholder:text-black placeholder:text-[13px] md:rounded-[5px] rounded-[3px]"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <span
                id="message-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#057A37] hover:bg-green-700 text-white py-4 md:rounded-[5px] rounded-[3px] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <LoadingSpinner size="sm" className="!flex-row" />}
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
