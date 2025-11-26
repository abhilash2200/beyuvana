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


