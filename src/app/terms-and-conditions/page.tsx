"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
            <HeaderText
                textalign="text-center"
                heading="Terms and Conditions"
                textcolor="text-[#1A2819]"
            />

            <p className="mt-6">
                Welcome to <strong>Beyuvana</strong>. By accessing or using our website and
                purchasing our collagen products, you agree to comply with and be bound
                by the following Terms and Conditions. Please read them carefully before
                using our services.
            </p>

            <h2 className="mt-8 font-semibold text-lg">1. General Information</h2>
            <p className="mt-2">
                Beyuvana operates this website to provide information and sell premium
                collagen-based products. By placing an order, you confirm that you are
                at least 18 years old and legally capable of entering into a binding
                contract.
            </p>

            <h2 className="mt-8 font-semibold text-lg">2. Product Information</h2>
            <p className="mt-2">
                We make every effort to ensure that product descriptions and images are
                accurate. However, slight variations in color, packaging, or texture may
                occur. These differences do not affect the product’s quality or
                performance.
            </p>

            <h2 className="mt-8 font-semibold text-lg">3. Pricing and Payment</h2>
            <p className="mt-2">
                All prices displayed on our website are inclusive of applicable taxes.
                Payments must be made through the secure payment gateways provided on
                our platform. We reserve the right to change prices at any time without
                prior notice.
            </p>

            <h2 className="mt-8 font-semibold text-lg">4. Shipping and Delivery</h2>
            <p className="mt-2">
                Orders are processed within 2–4 business days. Delivery timelines may
                vary based on your location. Once shipped, a tracking number will be
                shared with you via email or SMS.
            </p>

            <h2 className="mt-8 font-semibold text-lg">5. Returns and Refunds</h2>
            <p className="mt-2">
                Due to the nature of our products, we do not accept returns once a
                product is opened or used. However, if you receive a damaged or
                incorrect item, please contact our support within 48 hours of delivery
                for a replacement or refund.
            </p>

            <h2 className="mt-8 font-semibold text-lg">6. Limitation of Liability</h2>
            <p className="mt-2">
                Beyuvana is not responsible for any allergic reactions or side effects
                caused by misuse or unverified combinations of our products. Please read
                all ingredient details carefully before use or consult your healthcare
                provider if you have any concerns.
            </p>

            <h2 className="mt-8 font-semibold text-lg">7. Changes to Terms</h2>
            <p className="mt-2">
                We reserve the right to modify these Terms and Conditions at any time.
                Continued use of our website after changes have been posted constitutes
                your acceptance of the updated terms.
            </p>

            <h2 className="mt-8 font-semibold text-lg">8. Contact Us</h2>
            <p className="mt-2">
                For any questions about these Terms and Conditions, please contact us at{" "}
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
