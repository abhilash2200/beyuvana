import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice BEYUVANA™",
  description: "Download your invoice from BEYUVANA™.",
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
