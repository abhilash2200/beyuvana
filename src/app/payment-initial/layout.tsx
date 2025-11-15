import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Verification | BEYUVANA™",
  description: "Verifying your payment status with BEYUVANA™.",
  robots: { index: false, follow: false },
};

export default function PaymentInitialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

