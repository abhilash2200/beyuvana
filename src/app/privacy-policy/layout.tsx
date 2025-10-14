import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How BEYUVANA™ collects, uses, and protects your personal information.',
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