"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed min-h-[50vh]">
            <HeaderText
                textalign="text-center"
                heading="Shipping And Return Policy"
                textcolor="text-[#1A2819]"
            />

            <div className="mt-3 text-center">
                <p>Last updated: October 2025</p>
            </div>

            <p className="mt-6">
                Before unboxing video If approved we&apos;ll provide a replacement for the damaged product within 2-3 days ( we&apos;ll deliver the product within 2-3 days).
            </p>

            {/* <h2 className="mt-8 font-semibold text-lg">1. Shipping Coverage</h2>
            <p className="mt-2">
                We currently ship all orders across India through our trusted logistics partner Shiprocket. International shipping will be introduced soon.
            </p>

            <h2 className="mt-8 font-semibold text-lg">2. Dispatch & Delivery Time</h2>
            <p className="mt-2">
                All confirmed orders are processed and dispatched within 24 hours (Monday–Saturday, excluding public holidays).
            </p>
            <p className="mt-2">
                Once dispatched, delivery typically takes 1 working day in major cities and 2–5 working days for other locations depending on your PIN code.
            </p>
            <p className="mt-2">
                A tracking link will be shared with you via SMS or email once your order has been shipped.
            </p>

            <h2 className="mt-8 font-semibold text-lg">3. Shipping Partner</h2>
            <p className="mt-2">
                We use Shiprocket to ensure fast, secure, and reliable deliveries through India’s top courier networks.
            </p>

            <h2 className="mt-8 font-semibold text-lg">4. Shipping Charges</h2>
            <p className="mt-2">
                We offer free shipping on all prepaid orders above ₹499. A small handling fee may apply for Cash on Delivery (COD) orders.
            </p>

            <h2 className="mt-8 font-semibold text-lg">5. Undelivered Packages</h2>
            <p className="mt-2">
                If a shipment is returned due to an incorrect address or repeated failed delivery attempts, the customer will be responsible for re-shipping charges.
            </p>

            <h2 className="mt-8 font-semibold text-lg">6. Damaged or Wrong Product</h2>
            <p className="mt-2">
                If you receive a damaged or incorrect product, please contact us within 24 hours of delivery with clear photos at <a href="mailto:info.beyuvana@gmail.com" className="text-[#057A37] hover:underline">info.beyuvana@gmail.com</a>
                or call us at <a href="tel:+918777377060" className="text-[#057A37] hover:underline">+91 8777377060</a>.
                After verification, we’ll replace the product at no extra cost.
            </p>

            <h2 className="mt-8 font-semibold text-lg">7. No Return or Refund Policy</h2>
            <p className="mt-2">
                For hygiene and safety reasons, we do not accept returns or refunds once a product has been delivered.
            </p>
            <p className="mt-1">
                Replacements are only provided for damaged or incorrect shipments reported within 24 hours of delivery.
            </p> */}
        </div>
    );
};

export default Page;
