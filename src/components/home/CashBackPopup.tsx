"use client"
import { FC } from "react";

interface ListItemProps {
    text: string;
}

const ListItem: FC<ListItemProps> = ({ text }) => (
    <li className="flex items-start">
        <span className="text-green-600 mr-2">•</span>
        <p className="text-[14px] md:text-[16px]">{text}</p>
    </li>
);

interface SectionProps {
    title: string;
    items: string[];
}

const Section: FC<SectionProps> = ({ title, items }) => (
    <section className="mb-6">
        <h2 className="md:text-xl text-[15px] mb-3 text-[#0C4B33] font-[Grafiels]">{title}</h2>
        <ul className="space-y-3 text-[14px] md:text-[16px]">
            {items.map((item, index) => (
                <ListItem key={index} text={item} />
            ))}
        </ul>
    </section>
);

const CashBackPopup: FC = () => {
    const howItWorks = [
        "Use the product as recommended for 90 days, with consistent daily consumption.",
        "SRecord a 10-second video every day while consuming your BEYUVANA sachet for the full 90 days. This proof ensures your consistency.",
        "Submit your refund request with your Order ID and daily video proofs via email (info.beyuvana@gmail.com ) or\nWhatsApp (+91 87773 77060) within 90 days of delivery.",
        "Our team will verify your order and videos. A complimentary nutritionist consultation may be arranged to understand your experience and ensure eligibility.",
        "Valid only on orders placed directly at www.beyuvana.com within the last 90 days. Purchases made on third-party platforms (Amazon, Nykaa, etc.) are not covered.",
        "Applicable once per customer, only on our sachet wellness range (Collagen Builder & Glow Essence).",
    ];

    const whenItDoesntApply = [
        "If the sachets were not consumed consistently as per daily guidance.",
        "If the 10-second daily videos are missing or incomplete (even one day missing disqualifies eligibility).",
        "If an underlying health condition may have influenced individual experience.",
        "If the claim includes bundled products outside the sachet wellness range.",
        "If the refund request is made after 90 days of delivery.",
    ];

    return (
        <div className="w-full mx-auto text-gray-800 transition-colors h-[80vh] md:h-auto overflow-y-auto">
            <Section title="How It Works?" items={howItWorks} />
            <Section title="When It Doesn’t Apply" items={whenItDoesntApply} />

            <div className="bg-green-900 text-white p-4 rounded">
                <p className="text-[12px] font-light">If individual results are influenced by underlying health conditions, our team is here to guide you with care.<span className="text-[13px] font-normal"> BEYUVANA™ — Wellness, Naturally.</span></p>
            </div>
        </div>
    );
};

export default CashBackPopup;
