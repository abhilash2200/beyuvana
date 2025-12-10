"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import Offers from "@/components/common/Offers";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const excludeThankYou = pathname?.startsWith("/thank-you");
  const excludePaymentSuccess = pathname?.startsWith("/payment-success");
  const excludePaymentFailed = pathname?.startsWith("/payment-failed");
  const excludePaymentInitiate = pathname?.startsWith("/payment-initiate");
  const excludeInvoice = pathname?.startsWith("/invoice");

  // Pages that should not have header/footer
  const shouldExcludeLayout =
    excludeThankYou ||
    excludePaymentSuccess ||
    excludePaymentFailed ||
    excludePaymentInitiate ||
    excludeInvoice;

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Offers />
      <main id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </>
  );
}
