import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'About BEYUVANA™',
  description: 'Learn about BEYUVANA™: plant-powered, science-backed wellness crafted for visible glow.',
}


export default function AboutLayout({
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