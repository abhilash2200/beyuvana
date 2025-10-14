import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'BEYUVANA™ website usage terms, orders, shipping, and liability.',
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