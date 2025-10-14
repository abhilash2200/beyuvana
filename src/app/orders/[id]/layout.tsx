import { Metadata } from "next"


export async function generateMetadata(
    { params }: { params: Promise<{ id?: string }> }
): Promise<Metadata> {
    const resolvedParams = await params;
    const id = String(resolvedParams?.id || "");
    const safeId = encodeURIComponent(id);
    const title = `Order #${safeId} | BEYUVANA™`;
    const description = `Details and status for order #${safeId}.`;

    return {
        title,
        description,
        alternates: { canonical: `/orders/${safeId}` },
        robots: { index: false, follow: false },
        openGraph: {
            title,
            description,
            url: `/orders/${safeId}`,
            images: [{ url: "/assets/img/logo.png" }],
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: ["/assets/img/logo.png"],
        },
    };
}


export default function OrderDetailLayout({
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


