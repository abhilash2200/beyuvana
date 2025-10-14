import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping coverage, dispatch, delivery timelines and damages policy at BEYUVANA™.',
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