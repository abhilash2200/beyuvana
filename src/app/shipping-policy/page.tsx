"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
            <HeaderText
                textalign="text-center"
                heading="Shipping Policy"
                textcolor="text-[#1A2819]"
            />

            <p className="mt-6">
                Thank you for shopping with <strong>Beyuvana</strong>. We aim to deliver
                your collagen products in perfect condition and on time. This Shipping
                Policy outlines how we process, handle, and deliver your orders.
            </p>

            <h2 className="mt-8 font-semibold text-lg">1. Order Processing</h2>
            <p className="mt-2">
                All confirmed orders are processed within <strong>2–4 business days</strong>.
                Orders placed on weekends or public holidays will be processed on the
                next working day. You will receive a confirmation email once your order
                has been processed.
            </p>

            <h2 className="mt-8 font-semibold text-lg">2. Shipping Partners</h2>
            <p className="mt-2">
                We collaborate with trusted courier partners across India to ensure
                reliable and timely delivery. Once your package is shipped, you will
                receive tracking details via email or SMS.
            </p>

            <h2 className="mt-8 font-semibold text-lg">3. Estimated Delivery Time</h2>
            <p className="mt-2">
                Delivery timelines vary based on your location:
            </p>
            <ul className="list-disc ml-6 mt-2">
                <li>Metro cities: 3–5 business days</li>
                <li>Other locations: 5–8 business days</li>
                <li>Remote or rural areas: up to 10 business days</li>
            </ul>
            <p className="mt-2">
                Please note that delays caused by unforeseen logistics or weather
                conditions are beyond our control.
            </p>

            <h2 className="mt-8 font-semibold text-lg">4. Shipping Charges</h2>
            <p className="mt-2">
                We offer <strong>free shipping</strong> on all prepaid orders above ₹999.
                Orders below this amount may incur a nominal delivery charge, displayed
                at checkout before payment.
            </p>

            <h2 className="mt-8 font-semibold text-lg">5. Order Tracking</h2>
            <p className="mt-2">
                Once your order is dispatched, you will receive a tracking link via
                email or SMS. You can use this link to monitor the current status and
                estimated delivery time of your order.
            </p>

            <h2 className="mt-8 font-semibold text-lg">6. Delayed or Lost Shipments</h2>
            <p className="mt-2">
                In rare cases where your shipment is delayed or lost, please reach out
                to our support team with your order number. We will investigate and
                resolve the issue promptly.
            </p>

            <h2 className="mt-8 font-semibold text-lg">7. International Shipping</h2>
            <p className="mt-2">
                Currently, <strong>Beyuvana</strong> ships only within India. We do not
                offer international delivery at this time.
            </p>

            <h2 className="mt-8 font-semibold text-lg">8. Contact Us</h2>
            <p className="mt-2">
                For questions or assistance regarding shipping, please contact us at{" "}
                <a href="mailto:support@beyuvana.com" className="text-[#057A37]">
                    support@beyuvana.com
                </a>.
            </p>

            <p className="mt-8 text-sm italic">
                © {new Date().getFullYear()} Beyuvana. All rights reserved.
            </p>
        </div>
    );
};

export default Page;
