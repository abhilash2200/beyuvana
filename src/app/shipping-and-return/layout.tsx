import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Shipping & Return Policy',
  description: 'Shipping coverage, dispatch, delivery timelines, returns and damages policy at BEYUVANA™.',
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