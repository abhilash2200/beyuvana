import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Read BEYUVANA™ refund policy for damaged or incorrect products.',
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