import { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: { design_type?: string } }
): Promise<Metadata> {
  const slug = String(params?.design_type || "");

  // Basic metadata without importing client-side dependencies
  const title = `Product | BEYUVANA™`;
  const description = "Explore BEYUVANA™ plant-powered skin nutrition for visible glow.";

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title,
      description,
      url: `/product/${slug}`,
      type: "website",
      images: [{ url: "/assets/img/logo.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/img/logo.png"],
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  // Return known product slugs without importing client-side dependencies
  return [
    { design_type: "collagen-green" },
    { design_type: "collagen-pink" },
  ];
}


export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}