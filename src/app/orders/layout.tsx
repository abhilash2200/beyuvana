import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your BEYUVANA™ orders.",
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
