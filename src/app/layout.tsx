import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/common/ConditionalLayout";
import { AuthProvider } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "BEYUVANA™ | Plant-Powered Collagen Builder & Glow Nutrition",
    template: "%s | BEYUVANA™",
  },
  description:
    "BEYUVANA™ crafts plant-powered, science-backed nutrition for skin, gut, and whole-body wellness. 100% vegetarian, sugar-free, and consciously formulated for visible glow.",
  keywords: [""],
  openGraph: {
    title: "BEYUVANA™ | Plant-Powered Collagen Builder & Glow Nutrition",
    description:
      "Plant-powered, science-backed wellness for youthful, radiant skin. 100% vegetarian, sugar-free formulations.",
    url: "/",
    siteName: "BEYUVANA™",
    images: [
      {
        url: "/assets/img/logo.png",
        width: 512,
        height: 512,
        alt: "BEYUVANA logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BEYUVANA™ | Plant-Powered Collagen Builder & Glow Nutrition",
    description:
      "Plant-powered, science-backed wellness for youthful, radiant skin. 100% vegetarian, sugar-free formulations.",
    images: ["/assets/img/logo.png"],
  },
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
      <body className={`${beVietnamPro.variable} antialiased`} suppressHydrationWarning={true}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
