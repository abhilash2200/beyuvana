import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Contact BEYUVANA™',
    description: 'Get in touch with BEYUVANA™ support for orders, products, and partnerships.',
}


export default function ContactLayout({
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


