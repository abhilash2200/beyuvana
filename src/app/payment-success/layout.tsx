import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful | BEYUVANA™",
  description: "Your payment was successful. Thank you for your order with BEYUVANA™.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

