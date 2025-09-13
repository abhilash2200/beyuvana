"use client"
import { FC } from "react";

interface ListItemProps {
    text: string;
}

const ListItem: FC<ListItemProps> = ({ text }) => (
    <li className="flex items-start">
        <span className="text-green-600 mr-2">•</span>
        <p>{text}</p>
    </li>
);

interface SectionProps {
    title: string;
    items: string[];
}

const Section: FC<SectionProps> = ({ title, items }) => (
    <section className="mb-6">
        <h2 className="text-xl mb-3 text-[#0C4B33] font-[Grafiels]">{title}</h2>
        <ul className="space-y-3">
            {items.map((item, index) => (
                <ListItem key={index} text={item} />
            ))}
        </ul>
    </section>
);

const CashBackPopup: FC = () => {
    const howItWorks = [
        "Use the product as recommended for 60 days, with consistent daily consumption.",
        "Submit your refund request with your Order ID via email (customercare@beyuvana.com) or WhatsApp (+91-XXXXXXXXXX) within 60 days of delivery",
        "Our team will verify your order details. A complimentary nutritionist consultation may be arranged to understand your experience and ensure eligibility.",
        "Valid only on orders placed directly at www.beyuvana.com within the last 60 days. Purchases made on third-party platforms (Amazon, Nykaa, etc.) are not covered.",
        "Applicable once per customer, only on our sachet wellness range (Collagen Builder & Glow Essence).",
    ];

    const whenItDoesntApply = [
        "If the sachets were not consumed consistently as per guidance.",
        "If an underlying health condition may have influenced individual experience.",
        "If the claim is for product bundles that include items outside the sachet wellness range.",
    ];

    return (
        <div className="w-full mx-auto text-gray-800 transition-colors">
            <Section title="How It Works?" items={howItWorks} />
            <Section title="When It Doesn’t Apply" items={whenItDoesntApply} />

            <div className="bg-green-900 text-white p-4 rounded">
                <p className="text-[12px] font-light">If an underlying health condition may have influenced individual experience.<span className="text-[13px] font-normal"> BEYUVANA™ — Wellness, Naturally.</span></p>
            </div>
        </div>
    );
};

export default CashBackPopup;
