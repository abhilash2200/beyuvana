import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/common/ConditionalLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnvValidator } from "@/components/common/EnvValidator";
import { ModeLogger } from "@/components/common/ModeLogger";
import ToastContainerWrapper from "@/components/common/ToastContainerWrapper";
import { SkipLink } from "@/components/common/SkipLink";
import { ENV_CONFIG } from "@/lib/constants";

// Log mode on server startup
if (ENV_CONFIG.IS_PRODUCTION) {
  console.log("production mode");
} else {
  console.log("development");
}

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BEYUVANA™ | Plant-Powered Collagen Builder & Glow Nutrition",
    template: "%s | BEYUVANA™",
  },
  description:
    "BEYUVANA™ crafts plant-powered, science-backed nutrition for skin, gut, and whole-body wellness. 100% vegetarian, sugar-free, and consciously formulated for visible glow.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SkipLink />
        <ModeLogger />
        <EnvValidator />
        <TooltipProvider>
          <ErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <ToastContainerWrapper />
                <ConditionalLayout>{children}</ConditionalLayout>
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </body>
    </html>
  );
}
