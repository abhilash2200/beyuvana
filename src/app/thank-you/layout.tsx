import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | BEYUVANA™",
  description: "Thank you for your order with BEYUVANA™. Your plant-powered wellness journey starts here.",
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
