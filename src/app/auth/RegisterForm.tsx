"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { authApi } from "@/lib/api/auth";
import {
  validatePhone,
  validateRequired,
  validateEmail,
} from "@/lib/validation";
import { handleError } from "@/lib/error-handling";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface RegisterFormProps {
  onClose?: () => void;
  onOtpSent?: (
    phone: string,
    userData: { name: string; email: string; phone: string },
  ) => void;
}

export default function RegisterForm({ onOtpSent }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const phoneValidation = validatePhone(form.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "Please enter a valid phone number.");
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");

    const nameValidation = validateRequired(form.name, "Name");
    if (!nameValidation.isValid) {
      setError(nameValidation.error || "Please enter your name.");
      return;
    }

    const emailValidation = validateEmail(form.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register the user account first (without OTP)
      const registerResponse = await authApi.registerWithoutOtp({
        fullname: form.name,
        email: form.email,
        phonenumber: cleanPhone,
      });

      if (registerResponse.status === false) {
        const errorMsg = registerResponse.message || "Registration failed";

        // Handle specific error cases
        if (
          errorMsg.toLowerCase().includes("already exists") ||
          errorMsg.toLowerCase().includes("already registered")
        ) {
          throw new Error(
            "This phone number is already registered. Please try logging in instead.",
          );
        }

        throw new Error(errorMsg);
      }

      // Step 2: If registration successful, send OTP to the phone number
      const otpResponse = await authApi.sendOtp({ phonenumber: cleanPhone });

      if (otpResponse.status === false) {
        const errorMsg = otpResponse.message || "OTP send failed";
        throw new Error(errorMsg);
      }

      const userDataToPass = {
        name: form.name,
        email: form.email,
        phone: cleanPhone,
      };

      onOtpSent?.(cleanPhone, userDataToPass);

      toast.success(
        "Account created successfully! OTP sent to your phone number. Please verify to login.",
      );
    } catch (err: unknown) {
      const appError = handleError(err, {
        context: "RegisterForm",
        userMessage: "Registration failed. Please try again later.",
      });
      setError(
        appError.userMessage || "Registration failed. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 hidden md:block">
        <Image
          src="/assets/img/login-img.webp"
          width={491}
          height={780}
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 md:p-6 p-0 flex flex-col justify-center">
        <h2 className="text-[30px] text-[#057A37] mb-1 font-[Grafiels]">
          Register Now!
        </h2>
        <hr className="w-32 h-0.5 mb-4 bg-[#057A37]" />

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <label htmlFor="register-name" className="sr-only">
              Full Name
            </label>
            <Input
              id="register-name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              aria-describedby={error ? "register-error" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
          </div>
          <div>
            <label htmlFor="register-email" className="sr-only">
              Email Address
            </label>
            <Input
              id="register-email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              aria-describedby={error ? "register-error" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
          </div>
          <div>
            <label htmlFor="register-phone" className="sr-only">
              Phone Number
            </label>
            <Input
              id="register-phone"
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setForm({ ...form, phone: val });
              }}
              maxLength={10}
              required
              aria-describedby={error ? "register-error" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          {error && (
            <p
              id="register-error"
              className="text-red-500 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}

          <p className="text-[10px] text-gray-500">
            By continuing, you agree to Beyuvana’s Terms of Use and Privacy
            Policy.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full text-white bg-green-700 hover:bg-green-800 rounded-[5px] py-2 font-light flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading && <LoadingSpinner size="sm" className="!flex-row" />}
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
