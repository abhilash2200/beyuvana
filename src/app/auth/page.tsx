"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAndClearSessionExpiredMessage } from "@/lib/session-expired";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OtpVerifyForm from "./OtpVerifyForm";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Step = "login" | "register" | "otp";
type OtpData = {
  phone: string;
  userData?: { name: string; email: string; phone: string };
  isRegistration: boolean;
};

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const msg = getAndClearSessionExpiredMessage();
    if (msg) setSessionExpiredMessage(msg);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleLoginOtpSent = (phone: string) => {
    setOtpData({ phone, isRegistration: false });
    setStep("otp");
  };

  const handleRegisterOtpSent = (
    phone: string,
    userData?: { name: string; email: string; phone: string },
  ) => {
    setOtpData({ phone, userData, isRegistration: true });
    setStep("otp");
  };

  const handleOtpVerified = () => {
    setStep("login");
    setOtpData(null);
    router.replace("/");
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4FFF9] flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-6 transition hover:opacity-80">
        <Image
          src="/assets/img/logo.png"
          width={140}
          height={40}
          alt="Beyuvana logo"
        />
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-[#1E2C1E] shadow-lg p-6">
        {sessionExpiredMessage && (
          <div
            className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm"
            role="alert"
          >
            {sessionExpiredMessage}
          </div>
        )}

        {step === "otp" && otpData ? (
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-[#1A2819]">
              Verify OTP
            </h1>
            <OtpVerifyForm
              onVerified={handleOtpVerified}
              phone={otpData.phone}
              userData={otpData.userData}
              isRegistration={otpData.isRegistration}
            />
            <button
              type="button"
              onClick={() => {
                setStep(otpData.isRegistration ? "register" : "login");
                setOtpData(null);
              }}
              className="text-sm text-[#1A2819] hover:underline"
            >
              ← Back
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-[#1A2819] mb-4">
              Sign in or create an account
            </h1>
            <Tabs
              value={step}
              onValueChange={(v) => setStep(v as Step)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-0">
                <LoginForm
                onOtpSent={handleLoginOtpSent}
                onSwitchToRegister={() => setStep("register")}
              />
              </TabsContent>
              <TabsContent value="register" className="mt-0">
                <RegisterForm
                onOtpSent={handleRegisterOtpSent}
                onSwitchToLogin={() => setStep("login")}
              />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-[#1A2819]/80">
        <Link href="/" className="hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
