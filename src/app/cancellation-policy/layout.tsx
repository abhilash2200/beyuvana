import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Review BEYUVANA™ order cancellation window and process.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
