import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Initiate | BEYUVANA™",
  description: "Processing your payment with BEYUVANA™.",
  robots: { index: false, follow: false },
};

export default function PaymentInitiateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
