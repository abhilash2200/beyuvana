"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import Offers from "@/components/common/Offers";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const excludeHeaderFooter = pathname?.startsWith("/thank-you");

  if (excludeHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Offers />
      {children}
      <Footer />
    </>
  );
}
