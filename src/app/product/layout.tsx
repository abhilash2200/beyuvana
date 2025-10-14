import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore BEYUVANA™ plant-powered products for glow and wellness.',
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